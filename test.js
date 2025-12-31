// 简单的测试框架
class TestRunner {
    constructor() {
        this.tests = [];
        this.results = {
            total: 0,
            passed: 0,
            failed: 0
        };
    }

    describe(suiteName, callback) {
        const suite = {
            name: suiteName,
            tests: []
        };

        const it = (testName, testFn) => {
            suite.tests.push({
                name: testName,
                fn: testFn
            });
        };

        callback(it);
        this.tests.push(suite);
    }

    async run() {
        const resultsContainer = document.getElementById('test-results');
        resultsContainer.innerHTML = '';

        this.results = { total: 0, passed: 0, failed: 0 };

        for (const suite of this.tests) {
            const suiteDiv = document.createElement('div');
            suiteDiv.className = 'test-suite';

            const suiteTitle = document.createElement('h2');
            suiteTitle.textContent = suite.name;
            suiteDiv.appendChild(suiteTitle);

            for (const test of suite.tests) {
                this.results.total++;
                const testDiv = document.createElement('div');
                testDiv.className = 'test-case';

                const testName = document.createElement('div');
                testName.className = 'test-name';

                const statusSpan = document.createElement('span');
                statusSpan.className = 'test-status';

                try {
                    await test.fn();
                    testDiv.classList.add('passed');
                    statusSpan.classList.add('passed');
                    this.results.passed++;
                } catch (error) {
                    testDiv.classList.add('failed');
                    statusSpan.classList.add('failed');
                    this.results.failed++;

                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'test-error';
                    errorDiv.textContent = error.message;
                    testDiv.appendChild(errorDiv);
                }

                testName.appendChild(statusSpan);
                testName.appendChild(document.createTextNode(test.name));
                testDiv.insertBefore(testName, testDiv.firstChild);

                suiteDiv.appendChild(testDiv);
            }

            resultsContainer.appendChild(suiteDiv);
        }

        this.updateSummary();
    }

    updateSummary() {
        document.getElementById('total-tests').textContent = this.results.total;
        document.getElementById('passed-tests').textContent = this.results.passed;
        document.getElementById('failed-tests').textContent = this.results.failed;

        const passRate = this.results.total > 0
            ? ((this.results.passed / this.results.total) * 100).toFixed(1)
            : 0;
        document.getElementById('pass-rate').textContent = passRate + '%';
    }
}

// 断言函数
const assert = {
    equal(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(message || `Expected ${expected}, but got ${actual}`);
        }
    },
    true(value, message) {
        if (value !== true) {
            throw new Error(message || `Expected true, but got ${value}`);
        }
    },
    false(value, message) {
        if (value !== false) {
            throw new Error(message || `Expected false, but got ${value}`);
        }
    },
    deepEqual(actual, expected, message) {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
            throw new Error(message || `Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`);
        }
    }
};

// 工具函数（从 app.js 复制）
const utils = {
    parseDate(dateStr) {
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day);
    },

    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },

    addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    },

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

    daysBetween(date1, date2) {
        const oneDay = 24 * 60 * 60 * 1000;
        return Math.round((date2 - date1) / oneDay);
    }
};

// 验证器（从 app.js 简化版本）
// 注意：18个月 = 548天（365×1.5），入境和出境日都算（daysBetween + 1）
const validator = {
    getDaysInAustraliaForWindow(date, trips) {
        const windowStart = utils.addDays(date, -548); // 18个月 = 548天
        const windowEnd = date;

        let daysInAustralia = 0;

        trips.forEach(trip => {
            const tripStart = utils.parseDate(trip.entry);
            const tripEnd = utils.parseDate(trip.exit);

            const overlapStart = tripStart > windowStart ? tripStart : windowStart;
            const overlapEnd = tripEnd < windowEnd ? tripEnd : windowEnd;

            if (overlapStart <= overlapEnd) {
                // 入境和出境日都算，所以 +1
                daysInAustralia += utils.daysBetween(overlapStart, overlapEnd) + 1;
            }
        });

        return daysInAustralia;
    },

    isViolation(date, trips) {
        const daysInAustralia = this.getDaysInAustraliaForWindow(date, trips);
        return daysInAustralia > 365;
    }
};

// 测试套件
const runner = new TestRunner();

// 测试工具函数
runner.describe('工具函数测试', (it) => {
    it('parseDate 应该正确解析日期字符串', () => {
        const date = utils.parseDate('2024-07-04');
        assert.equal(date.getFullYear(), 2024);
        assert.equal(date.getMonth(), 6); // 月份从0开始
        assert.equal(date.getDate(), 4);
    });

    it('formatDate 应该正确格式化日期', () => {
        const date = new Date(2024, 6, 4); // 2024-07-04
        const formatted = utils.formatDate(date);
        assert.equal(formatted, '2024-07-04');
    });

    it('addDays 应该正确添加天数', () => {
        const date = utils.parseDate('2024-01-01');
        const newDate = utils.addDays(date, 10);
        assert.equal(utils.formatDate(newDate), '2024-01-11');
    });

    it('addDays 应该处理跨月情况', () => {
        const date = utils.parseDate('2024-01-25');
        const newDate = utils.addDays(date, 10);
        assert.equal(utils.formatDate(newDate), '2024-02-04');
    });

    it('addMonths 应该正确添加月份', () => {
        const date = utils.parseDate('2024-01-15');
        const newDate = utils.addMonths(date, 3);
        assert.equal(newDate.getMonth(), 3); // 4月 (从0开始)
    });

    it('addMonths 应该正确处理月末日期溢出（31->30）', () => {
        const date = utils.parseDate('2024-01-31');
        const newDate = utils.addMonths(date, 1);
        assert.equal(utils.formatDate(newDate), '2024-02-29', '1月31日+1个月应该是2月29日（闰年）');
    });

    it('addMonths 应该正确处理月末日期溢出（31->28）', () => {
        const date = utils.parseDate('2023-01-31');
        const newDate = utils.addMonths(date, 1);
        assert.equal(utils.formatDate(newDate), '2023-02-28', '1月31日+1个月应该是2月28日（平年）');
    });

    it('addMonths 往前推18个月应该正确处理月末（31->30）', () => {
        const date = utils.parseDate('2027-05-31');
        const newDate = utils.addMonths(date, -18);
        assert.equal(utils.formatDate(newDate), '2025-11-30', '5月31日往前推18个月应该是11月30日');
    });

    it('addMonths 应该正确处理跨年的月末日期', () => {
        const date = utils.parseDate('2024-03-31');
        const newDate = utils.addMonths(date, -18);
        assert.equal(utils.formatDate(newDate), '2022-09-30', '3月31日往前推18个月应该是9月30日');
    });

    it('daysBetween 应该正确计算天数差', () => {
        const date1 = utils.parseDate('2024-01-01');
        const date2 = utils.parseDate('2024-01-11');
        const days = utils.daysBetween(date1, date2);
        assert.equal(days, 10);
    });
});

// 测试 Condition 8558 验证逻辑
runner.describe('Condition 8558 验证逻辑', (it) => {
    it('getDaysInAustraliaForWindow 应该正确计算窗口内天数（入境和出境日都算）', () => {
        const trips = [
            { entry: '2024-01-01', exit: '2024-01-31' }
        ];
        const checkDate = utils.parseDate('2024-02-01');
        const days = validator.getDaysInAustraliaForWindow(checkDate, trips);
        assert.equal(days, 31, '1月1日到1月31日，入境和出境日都算，应该是31天');
    });

    it('getDaysInAustraliaForWindow 应该处理多个行程', () => {
        const trips = [
            { entry: '2024-01-01', exit: '2024-01-31' },
            { entry: '2024-03-01', exit: '2024-03-31' }
        ];
        const checkDate = utils.parseDate('2024-04-01');
        const days = validator.getDaysInAustraliaForWindow(checkDate, trips);
        assert.equal(days, 62, '31天 + 31天 = 62天（入境和出境日都算）');
    });

    it('getDaysInAustraliaForWindow 应该只计算窗口内的天数', () => {
        const trips = [
            { entry: '2023-01-01', exit: '2023-12-31' }
        ];
        const checkDate = utils.parseDate('2025-02-01');
        const days = validator.getDaysInAustraliaForWindow(checkDate, trips);
        // 548天前是 2023-08-12，行程在2023-12-31结束，所以窗口内有2023-08-12到2023-12-31（入境和出境日都算）
        const windowStart = utils.addDays(checkDate, -548);
        const expectedDays = utils.daysBetween(windowStart, utils.parseDate('2023-12-31')) + 1;
        assert.equal(days, expectedDays, '应该只计算窗口内的天数');
    });

    it('isViolation 应该检测违规情况（366天，入境和出境日都算）', () => {
        const trips = [
            { entry: '2024-01-01', exit: '2024-12-31' } // 366天（入境和出境日都算）
        ];
        const checkDate = utils.parseDate('2024-12-31');
        const violation = validator.isViolation(checkDate, trips);
        assert.true(violation, '超过365天应该被标记为违规');
    });

    it('isViolation 应该允许365天停留', () => {
        const trips = [
            { entry: '2024-01-01', exit: '2024-12-30' } // 365天（入境和出境日都算）
        ];
        const checkDate = utils.parseDate('2024-12-30');
        const violation = validator.isViolation(checkDate, trips);
        assert.false(violation, '正好365天不应该违规');
    });

    it('滑动窗口应该随时间移动', () => {
        const trips = [
            { entry: '2024-01-01', exit: '2024-12-30' } // 365天（入境和出境日都算）
        ];

        // 在2024-12-30，窗口包含整个行程，正好365天
        const checkDate1 = utils.parseDate('2024-12-30');
        const violation1 = validator.isViolation(checkDate1, trips);
        assert.false(violation1, '正好365天不应该违规');

        // 在2025-08-01，548天前是2024-02-01，只包含部分行程
        const checkDate2 = utils.parseDate('2025-08-01');
        const days2 = validator.getDaysInAustraliaForWindow(checkDate2, trips);
        assert.true(days2 < 365, '滑动窗口移动后，天数应该减少');
    });
});

// 测试边界情况
runner.describe('边界情况测试', (it) => {
    it('应该处理行程恰好跨越548天边界', () => {
        const trips = [
            { entry: '2023-01-01', exit: '2024-06-30' } // 547天（入境和出境日都算）
        ];
        const checkDate = utils.parseDate('2024-06-30');
        const days = validator.getDaysInAustraliaForWindow(checkDate, trips);
        // 548天前是 2022-12-09
        // 行程从 2023-01-01 开始，所以窗口内应该是整个行程
        const tripDays = utils.daysBetween(utils.parseDate('2023-01-01'), utils.parseDate('2024-06-30')) + 1;
        assert.equal(days, tripDays, '应该计算窗口内的天数');
    });

    it('应该正确处理行程部分在窗口内', () => {
        const trips = [
            { entry: '2023-01-01', exit: '2024-12-31' } // 731天的长行程
        ];
        const checkDate = utils.parseDate('2024-08-01');
        const days = validator.getDaysInAustraliaForWindow(checkDate, trips);

        // 548天前是 2023-02-10
        // 窗口应该从 2023-02-10 到 2024-08-01
        // 行程从 2023-01-01 开始，所以窗口内应该从 2023-02-10 开始计算
        const windowStart = utils.addDays(checkDate, -548);
        const expectedDays = utils.daysBetween(windowStart, checkDate) + 1;
        assert.equal(days, expectedDays, '应该只计算窗口内的部分');
    });

    it('应该处理同一天入境和出境', () => {
        const trips = [
            { entry: '2024-07-04', exit: '2024-07-04' }
        ];
        const checkDate = utils.parseDate('2024-07-04');
        const days = validator.getDaysInAustraliaForWindow(checkDate, trips);
        assert.equal(days, 1, '同一天入境和出境，入境和出境日都算，应该是1天');
    });

    it('应该处理连续多个短行程', () => {
        const trips = [];
        // 创建12个月，每个月停留30天（1日到30日，入境和出境日都算）
        for (let i = 0; i < 12; i++) {
            const month = i + 1;
            trips.push({
                entry: `2024-${String(month).padStart(2, '0')}-01`,
                exit: `2024-${String(month).padStart(2, '0')}-30`
            });
        }

        const checkDate = utils.parseDate('2024-12-31');
        const days = validator.getDaysInAustraliaForWindow(checkDate, trips);
        assert.equal(days, 360, '12个月每月30天（1日到30日）= 360天');
    });
});

// 测试闰年
runner.describe('闰年测试', (it) => {
    it('应该正确处理闰年2月29日', () => {
        const trips = [
            { entry: '2024-02-28', exit: '2024-03-01' }
        ];
        const checkDate = utils.parseDate('2024-03-01');
        const days = validator.getDaysInAustraliaForWindow(checkDate, trips);
        assert.equal(days, 3, '2月28日、2月29日、3月1日，入境和出境日都算，共3天');
    });

    it('应该正确计算闰年2月的天数', () => {
        const trips = [
            { entry: '2024-02-01', exit: '2024-02-29' }
        ];
        const checkDate = utils.parseDate('2024-02-29');
        const days = validator.getDaysInAustraliaForWindow(checkDate, trips);
        assert.equal(days, 29, '闰年2月1日到29日（入境和出境日都算）应该有29天');
    });

    it('应该正确计算平年2月的天数', () => {
        const trips = [
            { entry: '2023-02-01', exit: '2023-02-28' }
        ];
        const checkDate = utils.parseDate('2023-02-28');
        const days = validator.getDaysInAustraliaForWindow(checkDate, trips);
        assert.equal(days, 28, '平年2月1日到28日（入境和出境日都算）应该有28天');
    });

    it('应该正确处理跨越闰年2月29日的长期行程', () => {
        const trips = [
            { entry: '2024-02-15', exit: '2024-03-15' }
        ];
        const checkDate = utils.parseDate('2024-03-15');
        const days = validator.getDaysInAustraliaForWindow(checkDate, trips);
        // 2月15-29日: 15天, 3月1-15日: 15天, 总共30天（入境和出境日都算）
        assert.equal(days, 30, '跨越闰年2月29日的行程应该正确计算天数');
    });

    it('闰年整年366天应该违规（入境和出境日都算）', () => {
        const trips = [
            { entry: '2024-01-01', exit: '2024-12-31' } // 366天（入境和出境日都算）
        ];
        const checkDate = utils.parseDate('2024-12-31');
        const days = validator.getDaysInAustraliaForWindow(checkDate, trips);
        const violation = validator.isViolation(checkDate, trips);

        assert.equal(days, 366, '闰年整年应该是366天');
        assert.true(violation, '366天应该违规');
    });

    it('闰年365天不应该违规', () => {
        const trips = [
            { entry: '2024-01-01', exit: '2024-12-30' } // 365天（入境和出境日都算）
        ];
        const checkDate = utils.parseDate('2024-12-30');
        const days = validator.getDaysInAustraliaForWindow(checkDate, trips);
        const violation = validator.isViolation(checkDate, trips);

        assert.equal(days, 365, '应该正好365天');
        assert.false(violation, '正好365天不应该违规');
    });

    it('应该正确处理548天窗口中包含闰年2月', () => {
        const trips = [
            { entry: '2024-02-29', exit: '2024-02-29' }
        ];
        const checkDate = utils.parseDate('2024-02-29');
        const days = validator.getDaysInAustraliaForWindow(checkDate, trips);

        // 2月29日当天入境出境，入境和出境日都算，应该是1天
        assert.equal(days, 1, '2月29日当天入境出境，入境和出境日都算，应该是1天');
    });

    it('应该正确处理从闰年2月29日开始的18个月窗口', () => {
        // 从2024-02-29往后推18个月
        const startDate = utils.parseDate('2024-02-29');
        const after18Months = utils.addMonths(startDate, 18);

        // 应该到2025年8月底
        const expectedMonth = after18Months.getMonth(); // 7 = 8月
        assert.equal(expectedMonth, 7, '18个月后应该在8月');
    });

    it('比较闰年和平年相同日期范围的天数', () => {
        // 闰年行程（入境和出境日都算）
        const leapYearTrips = [
            { entry: '2024-01-01', exit: '2024-03-31' }
        ];
        const leapCheckDate = utils.parseDate('2024-03-31');
        const leapDays = validator.getDaysInAustraliaForWindow(leapCheckDate, leapYearTrips);

        // 平年行程（入境和出境日都算）
        const normalYearTrips = [
            { entry: '2023-01-01', exit: '2023-03-31' }
        ];
        const normalCheckDate = utils.parseDate('2023-03-31');
        const normalDays = validator.getDaysInAustraliaForWindow(normalCheckDate, normalYearTrips);

        // 闰年应该比平年多1天
        assert.equal(leapDays, 91, '闰年前3个月（1月1日到3月31日）应该是91天');
        assert.equal(normalDays, 90, '平年前3个月（1月1日到3月31日）应该是90天');
        assert.equal(leapDays - normalDays, 1, '闰年应该比平年多1天');
    });
});

// 测试实际使用场景
runner.describe('实际使用场景测试', (it) => {
    it('场景1: 用户计划停留337天（入境和出境日都算）', () => {
        const trips = [
            { entry: '2024-08-13', exit: '2025-07-15' } // 337天（入境和出境日都算）
        ];

        // 在2026-02-01，检查窗口使用情况
        const checkDate = utils.parseDate('2026-02-01');
        const days = validator.getDaysInAustraliaForWindow(checkDate, trips);

        // 548天前是 2024-08-11
        // 行程从 2024-08-13 开始到 2025-07-15（入境和出境日都算）
        // 所以窗口内应该是整个337天的行程
        assert.equal(days, 337, '窗口应该包含337天');
        assert.false(validator.isViolation(checkDate, trips), '337天不应该违规');
    });

    it('场景2: 用户停留365天后，不应该能再停留', () => {
        const trips = [
            { entry: '2024-01-01', exit: '2024-12-30' } // 365天（入境和出境日都算）
        ];

        const checkDate = utils.parseDate('2024-12-30');
        const days = validator.getDaysInAustraliaForWindow(checkDate, trips);
        assert.equal(days, 365, '应该正好365天');

        // 尝试添加一天（当天入境出境，实际1天）
        const tripsWithExtraDay = [
            ...trips,
            { entry: '2024-12-30', exit: '2024-12-30' }
        ];
        const violation = validator.isViolation(checkDate, tripsWithExtraDay);
        assert.true(violation, '当天入境出境是1天，加上365天总共366天，应该违规');
    });

    it('场景3: 长时间离境后，窗口应该释放', () => {
        const trips = [
            { entry: '2024-01-01', exit: '2024-06-30' } // 182天（入境和出境日都算）
        ];

        // 在行程结束后的548天后检查
        const checkDate = utils.parseDate('2026-02-01');
        const days = validator.getDaysInAustraliaForWindow(checkDate, trips);

        // 548天前是 2024-08-11
        // 行程在 2024-06-30 就结束了，已经不在窗口内
        assert.equal(days, 0, '超出548天窗口的行程应该被释放');
    });
});

// 运行所有测试
async function runAllTests() {
    await runner.run();
}

// 页面加载后自动运行测试
window.addEventListener('DOMContentLoaded', () => {
    runAllTests();
});
