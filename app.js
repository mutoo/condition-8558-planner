// 全局状态
const state = {
    visaStart: null,
    visaEnd: null,
    trips: [],
    expandedMonths: new Set(),
    editingTripId: null,  // 正在编辑的行程ID
    selectedDate: null    // 当前在modal中选中的日期
};

// Modal 相关函数
function showModal(title, content) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = content;
    document.getElementById('info-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('info-modal').style.display = 'none';
    state.selectedDate = null;
}

// 设置为入境日期
function setAsEntryDate() {
    if (state.selectedDate) {
        const dateStr = utils.formatDate(state.selectedDate);
        document.getElementById('entry-date').value = dateStr;
        closeModal();
        // 滚动到行程规划区域
        document.getElementById('trip-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
        // 聚焦到出境日期输入框
        setTimeout(() => {
            document.getElementById('exit-date').focus();
        }, 500);
    }
}

// 设置为出境日期
function setAsExitDate() {
    if (state.selectedDate) {
        const dateStr = utils.formatDate(state.selectedDate);
        document.getElementById('exit-date').value = dateStr;
        closeModal();
        // 滚动到行程规划区域
        document.getElementById('trip-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
        // 聚焦到添加按钮
        setTimeout(() => {
            document.getElementById('add-trip-btn').focus();
        }, 500);
    }
}

// 点击modal外部关闭
window.onclick = function(event) {
    const modal = document.getElementById('info-modal');
    if (event.target === modal) {
        closeModal();
    }
};

// ESC键关闭modal
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// 本地存储管理
const storage = {
    STORAGE_KEY: 'condition8558_data',

    // 保存数据到 localStorage
    save() {
        // 获取当前选中的有效期选项
        const selectedDuration = document.querySelector('input[name="duration"]:checked')?.value;
        const customEnd = selectedDuration === 'custom' ? document.getElementById('visa-end').value : null;

        const data = {
            visaStart: state.visaStart ? utils.formatDate(state.visaStart) : null,
            visaEnd: state.visaEnd ? utils.formatDate(state.visaEnd) : null,
            selectedDuration: selectedDuration,
            customEnd: customEnd,
            trips: state.trips,
            expandedMonths: Array.from(state.expandedMonths)
        };
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error('保存数据失败:', e);
        }
    },

    // 从 localStorage 加载数据
    load() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            if (data) {
                const parsed = JSON.parse(data);
                if (parsed.visaStart) {
                    state.visaStart = utils.parseDate(parsed.visaStart);
                }
                if (parsed.visaEnd) {
                    state.visaEnd = utils.parseDate(parsed.visaEnd);
                }
                if (parsed.trips) {
                    state.trips = parsed.trips;
                }
                if (parsed.expandedMonths) {
                    state.expandedMonths = new Set(parsed.expandedMonths);
                }

                // 恢复有效期选项
                if (parsed.selectedDuration) {
                    const radio = document.querySelector(`input[name="duration"][value="${parsed.selectedDuration}"]`);
                    if (radio) {
                        radio.checked = true;
                        // 如果是自定义选项，显示自定义结束日期输入框
                        if (parsed.selectedDuration === 'custom') {
                            document.getElementById('custom-end-group').style.display = 'block';
                            if (parsed.customEnd) {
                                document.getElementById('visa-end').value = parsed.customEnd;
                            }
                        }
                    }
                }

                return true;
            }
        } catch (e) {
            console.error('加载数据失败:', e);
        }
        return false;
    },

    // 清除数据
    clear() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
        } catch (e) {
            console.error('清除数据失败:', e);
        }
    }
};

// 工具函数
const utils = {
    // 解析日期字符串为 Date 对象（使用本地时间）
    parseDate(dateStr) {
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day);
    },

    // 格式化日期为 YYYY-MM-DD（使用本地时间）
    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },

    // 格式化日期为显示格式
    formatDisplayDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}年${month}月${day}日`;
    },

    // 添加月份
    addMonths(date, months) {
        const result = new Date(date);
        const originalDay = result.getDate();
        const targetMonth = result.getMonth() + months;

        result.setMonth(targetMonth);

        // 检查月份是否溢出（例如：1月31日 + 1个月 = 3月3日，而不是2月28/29日）
        // 如果溢出了，说明目标月份没有这一天，设置为目标月份的最后一天
        const expectedMonth = ((targetMonth % 12) + 12) % 12;
        if (result.getMonth() !== expectedMonth) {
            // 月份溢出了，回退到上个月的最后一天
            result.setDate(0);
        }

        return result;
    },

    // 添加天数
    addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    },

    // 计算两个日期之间的天数差
    daysBetween(date1, date2) {
        const oneDay = 24 * 60 * 60 * 1000;
        return Math.round((date2 - date1) / oneDay);
    },

    // 获取月份的第一天
    getMonthStart(year, month) {
        return new Date(year, month, 1);
    },

    // 获取月份的最后一天
    getMonthEnd(year, month) {
        return new Date(year, month + 1, 0);
    },

    // 获取月份名称
    getMonthName(year, month) {
        return `${year}年 ${month + 1}月`;
    }
};

// Condition 8558 验证逻辑
const validator = {
    // 检查在给定日期，过去548天（18个月）内在澳洲的天数
    // 注意：18个月 = 548天（365×1.5），入境和出境日都算（daysBetween + 1）
    getDaysInAustraliaForWindow(date, trips) {
        const windowStart = utils.addDays(date, -548); // 18个月 = 548天
        const windowEnd = date;

        let daysInAustralia = 0;

        trips.forEach(trip => {
            const tripStart = utils.parseDate(trip.entry);
            const tripEnd = utils.parseDate(trip.exit);

            // 计算行程与窗口的重叠部分
            const overlapStart = tripStart > windowStart ? tripStart : windowStart;
            const overlapEnd = tripEnd < windowEnd ? tripEnd : windowEnd;

            if (overlapStart <= overlapEnd) {
                // 入境和出境日都算，所以 +1
                daysInAustralia += utils.daysBetween(overlapStart, overlapEnd) + 1;
            }
        });

        return daysInAustralia;
    },

    // 检查某一天是否违反 Condition 8558
    isViolation(date, trips) {
        const daysInAustralia = this.getDaysInAustraliaForWindow(date, trips);
        return daysInAustralia > 365; // 12个月 = 365天
    },

    // 验证行程是否合法
    validateTrip(trip, existingTrips) {
        const entry = utils.parseDate(trip.entry);
        const exit = utils.parseDate(trip.exit);

        // 检查日期范围是否有效
        if (entry > exit) {
            return { valid: false, reason: '出境日期必须晚于或等于入境日期' };
        }

        // 检查是否在签证有效期内
        if (entry < state.visaStart || exit > state.visaEnd) {
            return { valid: false, reason: '行程不在签证有效期内' };
        }

        // 检查是否与现有行程重叠
        for (let existingTrip of existingTrips) {
            const existingEntry = utils.parseDate(existingTrip.entry);
            const existingExit = utils.parseDate(existingTrip.exit);

            if ((entry <= existingExit && exit >= existingEntry)) {
                return { valid: false, reason: '行程与现有行程重叠' };
            }
        }

        // 检查行程期间每一天是否违反 Condition 8558
        const allTrips = [...existingTrips, trip];
        let currentDate = new Date(entry);

        while (currentDate <= exit) {
            if (this.isViolation(currentDate, allTrips)) {
                return {
                    valid: false,
                    reason: `在 ${utils.formatDisplayDate(currentDate)} 违反 Condition 8558（18个月内超过12个月）`
                };
            }
            currentDate = utils.addDays(currentDate, 1);
        }

        return { valid: true, reason: '行程合法' };
    },

    // 获取每一天的状态
    getDayStatus(date, trips) {
        // 检查是否在签证有效期内
        if (date < state.visaStart || date > state.visaEnd) {
            return 'out-of-visa';
        }

        // 检查是否在澳洲
        const isInAustralia = trips.some(trip => {
            const entry = utils.parseDate(trip.entry);
            const exit = utils.parseDate(trip.exit);
            return date >= entry && date <= exit;
        });

        if (!isInAustralia) {
            // 不在澳洲，检查窗口是否已满
            const daysInWindow = this.getDaysInAustraliaForWindow(date, trips);
            if (daysInWindow >= 365) {
                return 'window-full';  // 窗口已满，不能入境
            }
            return 'normal';
        }

        // 检查是否违反规则
        if (this.isViolation(date, trips)) {
            return 'violation';
        }

        return 'valid-stay';
    }
};

// 日历渲染
const calendar = {
    // 渲染所有月份
    renderCalendar() {
        const container = document.getElementById('calendar-container');
        container.innerHTML = '';

        const months = this.getMonthsList();
        const firstMonth = months[0];
        const lastMonth = months[months.length - 1];

        // 默认展开第一个和最后一个月
        state.expandedMonths.add(`${firstMonth.year}-${firstMonth.month}`);
        state.expandedMonths.add(`${lastMonth.year}-${lastMonth.month}`);

        months.forEach(({ year, month }) => {
            const monthBlock = this.createMonthBlock(year, month);
            container.appendChild(monthBlock);
        });

        this.updateStats();
    },

    // 获取所有月份列表
    getMonthsList() {
        const months = [];
        let currentDate = new Date(state.visaStart.getFullYear(), state.visaStart.getMonth(), 1);
        const endDate = new Date(state.visaEnd.getFullYear(), state.visaEnd.getMonth(), 1);

        while (currentDate <= endDate) {
            months.push({
                year: currentDate.getFullYear(),
                month: currentDate.getMonth()
            });
            currentDate = utils.addMonths(currentDate, 1);
        }

        return months;
    },

    // 创建月份块
    createMonthBlock(year, month) {
        const monthKey = `${year}-${month}`;
        const isExpanded = state.expandedMonths.has(monthKey);

        const monthBlock = document.createElement('div');
        monthBlock.className = `month-block ${isExpanded ? 'expanded' : ''}`;

        // 计算月份状态
        const monthStatus = this.getMonthStatus(year, month);

        // 月份标题
        const header = document.createElement('div');
        header.className = `month-header ${monthStatus}`;
        header.innerHTML = `
            <span>${utils.getMonthName(year, month)}</span>
            <span class="expand-icon">▼</span>
        `;
        header.onclick = () => this.toggleMonth(monthKey, monthBlock);

        monthBlock.appendChild(header);

        // 日历内容
        if (isExpanded) {
            const calendarDiv = this.createMonthCalendar(year, month);
            monthBlock.appendChild(calendarDiv);
        }

        return monthBlock;
    },

    // 切换月份展开/收缩
    toggleMonth(monthKey, monthBlock) {
        const wasExpanded = state.expandedMonths.has(monthKey);

        if (wasExpanded) {
            // 收起月份
            state.expandedMonths.delete(monthKey);
            monthBlock.classList.remove('expanded');
            const calendar = monthBlock.querySelector('.month-calendar');
            if (calendar) {
                calendar.remove();
            }
        } else {
            // 展开月份
            state.expandedMonths.add(monthKey);
            monthBlock.classList.add('expanded');
            const [year, month] = monthKey.split('-').map(Number);
            const calendarDiv = this.createMonthCalendar(year, month);
            monthBlock.appendChild(calendarDiv);
        }
        storage.save();  // 保存展开/收缩状态
    },

    // 检查月份是否有行程
    monthHasTrips(year, month) {
        const monthStart = utils.getMonthStart(year, month);
        const monthEnd = utils.getMonthEnd(year, month);

        return state.trips.some(trip => {
            const entry = utils.parseDate(trip.entry);
            const exit = utils.parseDate(trip.exit);
            return (entry <= monthEnd && exit >= monthStart);
        });
    },

    // 获取月份状态
    getMonthStatus(year, month) {
        const monthStart = utils.getMonthStart(year, month);
        const monthEnd = utils.getMonthEnd(year, month);

        let hasViolation = false;
        let hasStay = false;
        let hasWindowFull = false;
        let hasNormal = false;
        let totalDays = 0;
        let windowFullDays = 0;

        let currentDate = new Date(monthStart);
        while (currentDate <= monthEnd) {
            const status = validator.getDayStatus(currentDate, state.trips);

            // 只统计签证有效期内的日期
            if (status !== 'out-of-visa') {
                totalDays++;

                if (status === 'violation') {
                    hasViolation = true;
                    break;
                }
                if (status === 'valid-stay') {
                    hasStay = true;
                }
                if (status === 'window-full') {
                    hasWindowFull = true;
                    windowFullDays++;
                }
                if (status === 'normal') {
                    hasNormal = true;
                }
            }

            currentDate = utils.addDays(currentDate, 1);
        }

        // 优先级：违规 > 整月窗口已满 > 有停留 > 正常
        if (hasViolation) return 'danger';

        // 如果整个月都是窗口已满（所有有效日期都是窗口已满）
        if (totalDays > 0 && windowFullDays === totalDays && !hasStay && !hasNormal) {
            return 'window-full';
        }

        if (hasStay) return 'safe';
        if (hasWindowFull) return 'warning';  // 部分日期窗口已满
        return '';
    },

    // 创建月份日历
    createMonthCalendar(year, month) {
        const calendarDiv = document.createElement('div');
        calendarDiv.className = 'month-calendar';

        const grid = document.createElement('div');
        grid.className = 'calendar-grid';

        // 添加星期标题
        const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
        weekdays.forEach(day => {
            const cell = document.createElement('div');
            cell.className = 'calendar-header-cell';
            cell.textContent = day;
            grid.appendChild(cell);
        });

        // 获取月份第一天是星期几
        const firstDay = utils.getMonthStart(year, month);
        const startWeekday = firstDay.getDay();

        // 添加空白单元格
        for (let i = 0; i < startWeekday; i++) {
            const cell = document.createElement('div');
            cell.className = 'calendar-day empty';
            grid.appendChild(cell);
        }

        // 添加日期单元格
        const lastDay = utils.getMonthEnd(year, month);
        const daysInMonth = lastDay.getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const status = validator.getDayStatus(date, state.trips);

            const cell = document.createElement('div');
            cell.className = `calendar-day ${status}`;
            cell.textContent = day;

            // 添加点击事件 - 只对签证有效期内的日期添加
            if (status !== 'out-of-visa') {
                cell.style.cursor = 'pointer';
                cell.onclick = () => this.showDateInfo(date);
            }

            grid.appendChild(cell);
        }

        calendarDiv.appendChild(grid);
        return calendarDiv;
    },

    // 显示日期信息
    showDateInfo(date) {
        // 保存选中的日期，供modal按钮使用
        state.selectedDate = date;

        const dateStr = utils.formatDisplayDate(date);

        // 计算18个月滑动窗口的使用情况（18个月 = 548天）
        const windowStart = utils.addDays(date, -548); // 18个月 = 548天
        const windowEnd = date;

        let daysUsed = 0;
        const affectingTrips = [];

        state.trips.forEach(trip => {
            const tripStart = utils.parseDate(trip.entry);
            const tripEnd = utils.parseDate(trip.exit);

            // 计算行程与窗口的重叠部分（入境和出境日都算）
            const overlapStart = tripStart > windowStart ? tripStart : windowStart;
            const overlapEnd = tripEnd < windowEnd ? tripEnd : windowEnd;

            if (overlapStart <= overlapEnd) {
                const days = utils.daysBetween(overlapStart, overlapEnd) + 1;
                daysUsed += days;
                affectingTrips.push({
                    entry: trip.entry,
                    exit: trip.exit,
                    days: days
                });
            }
        });

        const daysRemaining = 365 - daysUsed;
        const percentage = ((daysUsed / 365) * 100).toFixed(1);

        // 检查该日期是否在现有行程内
        let currentTrip = null;
        for (let trip of state.trips) {
            const tripStart = utils.parseDate(trip.entry);
            const tripEnd = utils.parseDate(trip.exit);
            if (date >= tripStart && date <= tripEnd) {
                currentTrip = trip;
                break;
            }
        }

        // 构建HTML内容
        let htmlContent = `
            <h4>📊 18个月滑动窗口使用情况</h4>
            <div class="info-row">
                <span class="info-label">窗口期间</span>
                <span class="info-value">${utils.formatDisplayDate(windowStart)} - ${dateStr}</span>
            </div>
            <div class="info-row">
                <span class="info-label">已使用</span>
                <span class="info-value">${daysUsed} 天 (${percentage}%)</span>
            </div>
            <div class="info-row">
                <span class="info-label">剩余</span>
                <span class="info-value">${daysRemaining} 天</span>
            </div>
        `;

        if (affectingTrips.length > 0) {
            htmlContent += `<h4>影响此窗口的行程</h4><ul>`;
            affectingTrips.forEach((trip, index) => {
                const entry = utils.parseDate(trip.entry);
                const exit = utils.parseDate(trip.exit);
                htmlContent += `<li>${utils.formatDisplayDate(entry)} - ${utils.formatDisplayDate(exit)} (${trip.days}天)</li>`;
            });
            htmlContent += `</ul>`;
        }

        // 如果该日期在现有行程内，显示该行程信息
        if (currentTrip) {
            const tripStart = utils.parseDate(currentTrip.entry);
            const tripEnd = utils.parseDate(currentTrip.exit);
            htmlContent += `
                <div class="highlight">
                    <strong>📍 此日期在现有行程内</strong><br>
                    ${utils.formatDisplayDate(tripStart)} - ${utils.formatDisplayDate(tripEnd)}
                </div>
            `;
        }

        // 计算从该日期开始可以连续停留的最大天数（会自动排除包含该日期的行程）
        const maxConsecutiveDays = this.calculateMaxConsecutiveStay(date);

        if (maxConsecutiveDays <= 0) {
            htmlContent += `
                <div class="danger">
                    <strong>⚠️ 窗口已满，无法在此日期入境！</strong>
                </div>
            `;
            const nextValidDate = this.findNextValidEntryDate(date);
            if (nextValidDate) {
                htmlContent += `
                    <div class="success">
                        <strong>✅ 下一个可入境日期</strong><br>
                        ${utils.formatDisplayDate(nextValidDate)}<br>
                        <small>（需等待 ${utils.daysBetween(date, nextValidDate)} 天）</small>
                    </div>
                `;
            }
        } else {
            const messageClass = maxConsecutiveDays < 30 ? 'warning' : 'success';
            let messageText = currentTrip
                ? `💡 如果从此日期重新规划，最多可连续停留：<strong>${maxConsecutiveDays} 天</strong>`
                : `✅ 从此日期开始，最多可连续停留：<strong>${maxConsecutiveDays} 天</strong>`;

            if (maxConsecutiveDays < 30) {
                messageText += `<br><small>⚠️ 警告：可停留天数较少！</small>`;
            }

            htmlContent += `<div class="${messageClass}">${messageText}</div>`;
        }

        showModal(dateStr, htmlContent);
    },

    // 计算从指定日期开始可以连续停留的最大天数（考虑滑动窗口动态变化）
    calculateMaxConsecutiveStay(startDate) {
        let maxDays = 0;

        // 过滤掉包含 startDate 的行程，避免重复计算
        const relevantTrips = state.trips.filter(trip => {
            const tripStart = utils.parseDate(trip.entry);
            const tripEnd = utils.parseDate(trip.exit);
            // 排除包含 startDate 的行程
            return !(startDate >= tripStart && startDate <= tripEnd);
        });

        // 找到下一个行程的开始日期，作为可停留的最大边界
        let nextTripStart = null;
        relevantTrips.forEach(trip => {
            const tripStart = utils.parseDate(trip.entry);
            if (tripStart > startDate) {
                if (!nextTripStart || tripStart < nextTripStart) {
                    nextTripStart = tripStart;
                }
            }
        });

        // 最多检查365天（因为12个月是上限）
        for (let day = 1; day <= 365; day++) {
            // 当前检查的日期（新行程的第day天，这是出境日期）
            const exitDate = utils.addDays(startDate, day - 1);

            // 检查是否超出签证有效期
            if (exitDate > state.visaEnd) {
                break;
            }

            // 检查是否会与下一个行程重叠
            if (nextTripStart && exitDate >= nextTripStart) {
                break;
            }

            // 检查这个新行程 [startDate, exitDate] 是否会违反规则
            // 需要检查这个行程中的每一天
            let isValid = true;

            for (let d = 0; d < day; d++) {
                const checkDate = utils.addDays(startDate, d);
                const windowStart = utils.addDays(checkDate, -548); // 18个月 = 548天
                const windowEnd = checkDate;

                // 计算相关行程在窗口中的天数（入境和出境日都算）
                let daysInWindow = 0;
                relevantTrips.forEach(trip => {
                    const tripStart = utils.parseDate(trip.entry);
                    const tripEnd = utils.parseDate(trip.exit);

                    const overlapStart = tripStart > windowStart ? tripStart : windowStart;
                    const overlapEnd = tripEnd < windowEnd ? tripEnd : windowEnd;

                    if (overlapStart <= overlapEnd) {
                        daysInWindow += utils.daysBetween(overlapStart, overlapEnd) + 1;
                    }
                });

                // 计算新行程在窗口中的天数（入境和出境日都算）
                const newTripStart = startDate > windowStart ? startDate : windowStart;
                const newTripEnd = checkDate; // 新行程到checkDate为止
                if (newTripStart <= newTripEnd) {
                    daysInWindow += utils.daysBetween(newTripStart, newTripEnd) + 1;
                }

                // 如果超过365天，这个新行程不合法
                if (daysInWindow > 365) {
                    isValid = false;
                    break;
                }
            }

            if (!isValid) {
                break;
            }

            // 可以待这么多天
            maxDays = day;
        }

        return maxDays;
    },

    // 查找下一个有效的入境日期
    findNextValidEntryDate(fromDate) {
        // 从指定日期开始，每天检查，直到找到可以入境的日期
        let checkDate = new Date(fromDate);
        const maxCheckDays = 570; // 最多检查18个月（18×31=558天，加上余量）

        for (let i = 1; i <= maxCheckDays; i++) {
            checkDate = utils.addDays(fromDate, i);

            // 检查是否超出签证有效期
            if (checkDate > state.visaEnd) {
                return null;
            }

            // 计算该日期的18个月窗口使用情况（18个月 = 548天）
            const windowStart = utils.addDays(checkDate, -548);
            let daysUsed = 0;

            state.trips.forEach(trip => {
                const tripStart = utils.parseDate(trip.entry);
                const tripEnd = utils.parseDate(trip.exit);

                const overlapStart = tripStart > windowStart ? tripStart : windowStart;
                const overlapEnd = tripEnd < checkDate ? tripEnd : checkDate;

                if (overlapStart <= overlapEnd) {
                    daysUsed += utils.daysBetween(overlapStart, overlapEnd) + 1;
                }
            });

            // 如果该日期的窗口有至少1天剩余，就是有效的
            if (daysUsed < 365) {
                return checkDate;
            }
        }

        return null;
    },

    // 更新统计信息
    updateStats() {
        const statsPanel = document.getElementById('stats-panel');

        // 计算总在澳天数（入境和出境日都算）
        let totalDays = 0;
        state.trips.forEach(trip => {
            const entry = utils.parseDate(trip.entry);
            const exit = utils.parseDate(trip.exit);
            totalDays += utils.daysBetween(entry, exit) + 1;
        });

        // 计算违规天数
        let violationDays = 0;
        if (state.trips.length > 0) {
            let currentDate = new Date(state.visaStart);
            while (currentDate <= state.visaEnd) {
                if (validator.getDayStatus(currentDate, state.trips) === 'violation') {
                    violationDays++;
                }
                currentDate = utils.addDays(currentDate, 1);
            }
        }

        statsPanel.innerHTML = `
            <div class="stat-item">
                <div class="stat-label">签证有效期</div>
                <div class="stat-value">${utils.formatDisplayDate(state.visaStart)} - ${utils.formatDisplayDate(state.visaEnd)}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">已规划行程</div>
                <div class="stat-value">${state.trips.length} 次</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">总在澳天数</div>
                <div class="stat-value">${totalDays} 天</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">违规天数</div>
                <div class="stat-value" style="color: ${violationDays > 0 ? '#ef4444' : '#10b981'}">${violationDays} 天</div>
            </div>
        `;
    }
};

// 行程管理
const tripManager = {
    // 添加行程
    addTrip(entry, exit) {
        const trip = { entry, exit, id: Date.now() };
        const validation = validator.validateTrip(trip, state.trips);

        if (validation.valid) {
            state.trips.push(trip);
            state.trips.sort((a, b) => new Date(a.entry) - new Date(b.entry));
            this.renderTripsList();
            calendar.renderCalendar();
            storage.save();  // 保存到 localStorage
            return true;
        } else {
            alert(validation.reason);
            return false;
        }
    },

    // 更新行程
    updateTrip(id, entry, exit) {
        const tripIndex = state.trips.findIndex(t => t.id === id);
        if (tripIndex === -1) return false;

        const updatedTrip = { entry, exit, id };
        const otherTrips = state.trips.filter(t => t.id !== id);
        const validation = validator.validateTrip(updatedTrip, otherTrips);

        if (validation.valid) {
            state.trips[tripIndex] = updatedTrip;
            state.trips.sort((a, b) => new Date(a.entry) - new Date(b.entry));
            this.renderTripsList();
            calendar.renderCalendar();
            storage.save();  // 保存到 localStorage
            return true;
        } else {
            alert(validation.reason);
            return false;
        }
    },

    // 编辑行程
    editTrip(id) {
        const trip = state.trips.find(t => t.id === id);
        if (!trip) return;

        // 填充表单
        document.getElementById('entry-date').value = trip.entry;
        document.getElementById('exit-date').value = trip.exit;

        // 设置编辑状态
        state.editingTripId = id;

        // 更新按钮文本
        const btn = document.getElementById('add-trip-btn');
        btn.textContent = '保存修改';
        btn.className = 'primary-btn';

        // 显示取消按钮
        let cancelBtn = document.getElementById('cancel-edit-btn');
        if (!cancelBtn) {
            cancelBtn = document.createElement('button');
            cancelBtn.id = 'cancel-edit-btn';
            cancelBtn.className = 'cancel-btn';
            cancelBtn.textContent = '取消';
            cancelBtn.onclick = () => this.cancelEdit();
            btn.parentNode.appendChild(cancelBtn);
        }

        // 滚动到表单
        document.getElementById('trip-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
    },

    // 取消编辑
    cancelEdit() {
        state.editingTripId = null;
        document.getElementById('entry-date').value = '';
        document.getElementById('exit-date').value = '';

        const btn = document.getElementById('add-trip-btn');
        btn.textContent = '添加行程';
        btn.className = 'secondary-btn';

        const cancelBtn = document.getElementById('cancel-edit-btn');
        if (cancelBtn) {
            cancelBtn.remove();
        }
    },

    // 删除行程
    deleteTrip(id) {
        if (confirm('确定要删除这个行程吗？')) {
            // 如果正在编辑这个行程，取消编辑
            if (state.editingTripId === id) {
                this.cancelEdit();
            }
            state.trips = state.trips.filter(trip => trip.id !== id);
            this.renderTripsList();
            calendar.renderCalendar();
            storage.save();  // 保存到 localStorage
        }
    },

    // 渲染行程列表
    renderTripsList() {
        const container = document.getElementById('trips-list');

        if (state.trips.length === 0) {
            container.innerHTML = '<p style="color: #999; text-align: center;">暂无行程</p>';
            return;
        }

        container.innerHTML = '';
        state.trips.forEach(trip => {
            const validation = validator.validateTrip(trip, state.trips.filter(t => t.id !== trip.id));
            const tripDiv = document.createElement('div');
            tripDiv.className = `trip-item ${validation.valid ? 'valid' : 'invalid'} ${state.editingTripId === trip.id ? 'editing' : ''}`;

            const entry = utils.parseDate(trip.entry);
            const exit = utils.parseDate(trip.exit);
            const days = utils.daysBetween(entry, exit) + 1; // 入境和出境日都算

            tripDiv.innerHTML = `
                <div class="trip-info">
                    <div><strong>${utils.formatDisplayDate(entry)} - ${utils.formatDisplayDate(exit)}</strong> (${days}天)</div>
                    <div class="trip-status">${validation.reason}</div>
                </div>
                <div class="trip-actions">
                    <button class="edit-btn" onclick="tripManager.editTrip(${trip.id})">编辑</button>
                    <button class="delete-btn" onclick="tripManager.deleteTrip(${trip.id})">删除</button>
                </div>
            `;

            container.appendChild(tripDiv);
        });
    }
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 尝试从 localStorage 加载数据
    const hasData = storage.load();

    if (hasData && state.visaStart && state.visaEnd) {
        // 如果有保存的数据，恢复界面
        document.getElementById('visa-start').value = utils.formatDate(state.visaStart);
        document.getElementById('two-column-layout').style.display = 'flex';
        document.getElementById('clear-data-btn').style.display = 'block';
        document.getElementById('start-btn').textContent = '重新规划';
        calendar.renderCalendar();
        tripManager.renderTripsList();
    } else {
        // 否则设置默认日期为今天
        const today = utils.formatDate(new Date());
        document.getElementById('visa-start').value = today;
        document.getElementById('start-btn').textContent = '开始规划';
    }

    // 持续时长选项切换
    document.querySelectorAll('input[name="duration"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const customEndGroup = document.getElementById('custom-end-group');
            if (e.target.value === 'custom') {
                customEndGroup.style.display = 'block';
            } else {
                customEndGroup.style.display = 'none';
            }
        });
    });

    // 开始规划按钮
    document.getElementById('start-btn').addEventListener('click', () => {
        const startInput = document.getElementById('visa-start').value;
        if (!startInput) {
            alert('请选择签证开始日期');
            return;
        }

        state.visaStart = utils.parseDate(startInput);

        const selectedDuration = document.querySelector('input[name="duration"]:checked').value;

        if (selectedDuration === 'custom') {
            const endInput = document.getElementById('visa-end').value;
            if (!endInput) {
                alert('请选择签证结束日期');
                return;
            }
            state.visaEnd = utils.parseDate(endInput);
        } else {
            const months = parseInt(selectedDuration);
            state.visaEnd = utils.addMonths(state.visaStart, months);
            state.visaEnd = utils.addDays(state.visaEnd, -1); // 减去1天，使其为有效期最后一天
        }

        if (state.visaStart >= state.visaEnd) {
            alert('签证结束日期必须晚于开始日期');
            return;
        }

        // 显示两栏布局和清除按钮
        document.getElementById('two-column-layout').style.display = 'flex';
        document.getElementById('clear-data-btn').style.display = 'block';
        document.getElementById('start-btn').textContent = '重新规划';

        // 重置状态（清空行程和展开的月份）
        state.trips = [];
        state.expandedMonths.clear();

        // 渲染日历
        calendar.renderCalendar();
        tripManager.renderTripsList();

        // 保存签证信息
        storage.save();

        // 滚动到两栏布局
        document.getElementById('two-column-layout').scrollIntoView({ behavior: 'smooth' });
    });

    // 添加/更新行程按钮
    document.getElementById('add-trip-btn').addEventListener('click', () => {
        const entry = document.getElementById('entry-date').value;
        const exit = document.getElementById('exit-date').value;

        if (!entry || !exit) {
            alert('请选择入境和出境日期');
            return;
        }

        // 判断是添加还是编辑
        if (state.editingTripId) {
            // 编辑模式
            if (tripManager.updateTrip(state.editingTripId, entry, exit)) {
                tripManager.cancelEdit();
            }
        } else {
            // 添加模式
            if (tripManager.addTrip(entry, exit)) {
                // 清空输入
                document.getElementById('entry-date').value = '';
                document.getElementById('exit-date').value = '';
            }
        }
    });

    // 设置最大出境日期按钮
    document.getElementById('set-max-exit-btn').addEventListener('click', () => {
        const entryInput = document.getElementById('entry-date').value;

        if (!entryInput) {
            alert('请先选择入境日期');
            return;
        }

        if (!state.visaStart || !state.visaEnd) {
            alert('请先设置签证有效期');
            return;
        }

        const entryDate = utils.parseDate(entryInput);

        // 检查入境日期是否在签证有效期内
        if (entryDate < state.visaStart || entryDate > state.visaEnd) {
            alert('入境日期不在签证有效期内');
            return;
        }

        // 计算从该日期开始的最大连续停留天数
        const maxDays = calendar.calculateMaxConsecutiveStay(entryDate);

        if (maxDays <= 0) {
            alert('该日期无法入境，窗口已满或有行程冲突');
            return;
        }

        // 计算最大出境日期
        const maxExitDate = utils.addDays(entryDate, maxDays - 1);
        const exitDateStr = utils.formatDate(maxExitDate);

        // 设置出境日期
        document.getElementById('exit-date').value = exitDateStr;

        // 显示提示信息
        alert(`已设置为最大停留期：${maxDays} 天\n出境日期：${exitDateStr}`);
    });

    // 清除所有数据按钮
    document.getElementById('clear-data-btn').addEventListener('click', () => {
        if (confirm('确定要清除所有数据吗？此操作无法撤销。')) {
            // 清除 localStorage
            storage.clear();

            // 重置状态
            state.visaStart = null;
            state.visaEnd = null;
            state.trips = [];
            state.expandedMonths.clear();
            state.editingTripId = null;

            // 重置界面
            const today = utils.formatDate(new Date());
            document.getElementById('visa-start').value = today;
            document.getElementById('visa-end').value = '';
            document.getElementById('entry-date').value = '';
            document.getElementById('exit-date').value = '';
            document.getElementById('two-column-layout').style.display = 'none';
            document.getElementById('clear-data-btn').style.display = 'none';
            document.getElementById('start-btn').textContent = '开始规划';

            // 如果在编辑模式，取消编辑
            if (state.editingTripId) {
                tripManager.cancelEdit();
            }

            alert('所有数据已清除');
        }
    });
});
