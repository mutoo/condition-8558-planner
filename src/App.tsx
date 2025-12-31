import { useState } from 'react'
import { useAppState } from './hooks/useAppState'
import { VisaSetup } from './components/VisaSetup'
import { TripManager } from './components/TripManager'
import { StatsPanel } from './components/StatsPanel'
import { Calendar } from './components/Calendar'
import { calculateStatistics } from './utils/tripUtils'
import { formatDate } from './utils/dateUtils'
import './styles/App.css'

function App() {
  const {
    state,
    setVisaPeriod,
    addTrip,
    updateTrip,
    deleteTrip,
    clearAllData,
  } = useAppState()

  const [selectedEntryDate, setSelectedEntryDate] = useState<string>('')
  const [selectedExitDate, setSelectedExitDate] = useState<string>('')

  const hasStarted = state.visaStart !== null && state.visaEnd !== null
  const stats = hasStarted
    ? calculateStatistics(state.trips, state.visaStart!, state.visaEnd!)
    : null

  const handleSetEntryDate = (date: Date) => {
    setSelectedEntryDate(formatDate(date))
    // Scroll to trip section
    setTimeout(() => {
      document.getElementById('trip-section')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }, 100)
  }

  const handleSetExitDate = (date: Date) => {
    setSelectedExitDate(formatDate(date))
    // Scroll to trip section
    setTimeout(() => {
      document.getElementById('trip-section')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }, 100)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>澳洲签证 Condition 8558 行程规划器</h1>
        <p className="app-description">
          帮助您规划行程并验证是否符合 Condition 8558 的要求
        </p>
      </header>

      <main className="app-main">
        <section className="info-section">
          <h2>关于 Condition 8558</h2>
          <div className="info-box">
            <p>
              <strong>Condition 8558</strong>{' '}
              是澳大利亚签证的一项常见限制条件，规定：
            </p>
            <ul>
              <li>
                在任意连续的 <strong>18个月</strong> 期间内
              </li>
              <li>
                持有人在澳大利亚的停留时间不得超过 <strong>12个月</strong>
              </li>
              <li>
                这是一个<strong>滑动窗口</strong>计算，以日为单位
              </li>
            </ul>
            <p className="note">
              本工具帮助您规划行程并验证是否符合此条件的要求。
            </p>
          </div>
        </section>

        <VisaSetup
          onStart={setVisaPeriod}
          onClearData={clearAllData}
          hasData={hasStarted || state.trips.length > 0}
        />

        {hasStarted && (
          <div className="two-column-layout">
            <div className="left-column">
              {stats && state.visaStart && state.visaEnd && (
                <StatsPanel
                  stats={stats}
                  visaStart={state.visaStart}
                  visaEnd={state.visaEnd}
                />
              )}

              <div id="trip-section">
                <TripManager
                  trips={state.trips}
                  visaStart={state.visaStart!}
                  visaEnd={state.visaEnd!}
                  onAddTrip={addTrip}
                  onUpdateTrip={updateTrip}
                  onDeleteTrip={deleteTrip}
                  initialEntryDate={selectedEntryDate}
                  initialExitDate={selectedExitDate}
                />
              </div>
            </div>

            <div className="right-column">
              <Calendar
                visaStart={state.visaStart!}
                visaEnd={state.visaEnd!}
                trips={state.trips}
                onSetEntryDate={handleSetEntryDate}
                onSetExitDate={handleSetExitDate}
              />
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>本工具仅供参考，具体签证条件请以澳大利亚移民局官方文件为准。</p>
      </footer>
    </div>
  )
}

export default App
