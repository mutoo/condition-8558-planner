import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppState } from './hooks/useAppState'
import { VisaSetup } from './components/VisaSetup'
import { TripManager } from './components/TripManager'
import { StatsPanel } from './components/StatsPanel'
import { Calendar, type CalendarRef } from './components/Calendar'
import { LanguageSwitcher } from './components/LanguageSwitcher'
import { calculateStatistics } from './utils/tripUtils'
import { formatDate, parseDate } from './utils/dateUtils'
import './styles/App.css'

function App() {
  const { t } = useTranslation()
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
  const calendarRef = useRef<CalendarRef>(null)

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
  
  const handleTripDateClick = (dateString: string) => {
    const date = parseDate(dateString)
    calendarRef.current?.scrollToDate(date)
  }

  return (
    <div className="app">
      <LanguageSwitcher />
      <header className="app-header">
        <h1>{t('app.title')}</h1>
        <p className="app-description">{t('app.description')}</p>
      </header>

      <main className="app-main">
        <section className="info-section">
          <h2>{t('info.title')}</h2>
          <div className="info-box">
            <p dangerouslySetInnerHTML={{ __html: t('info.description') }} />
            <ul>
              <li dangerouslySetInnerHTML={{ __html: t('info.rule1') }} />
              <li dangerouslySetInnerHTML={{ __html: t('info.rule2') }} />
              <li dangerouslySetInnerHTML={{ __html: t('info.rule3') }} />
            </ul>
            <p className="note">{t('info.note')}</p>
          </div>

          <div className="info-box disclaimer-box">
            <h3>{t('info.disclaimer.title')}</h3>
            <p>{t('info.disclaimer.officialDefinition')}</p>
            <p dangerouslySetInnerHTML={{ __html: t('info.disclaimer.appDefinition') }} />
            <p>{t('info.disclaimer.entryExitRule')}</p>
            <p className="warning-note">{t('info.disclaimer.warning')}</p>
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
                  onDateClick={handleTripDateClick}
                />
              </div>

              {stats && state.visaStart && state.visaEnd && (
                <StatsPanel
                  stats={stats}
                  visaStart={state.visaStart}
                  visaEnd={state.visaEnd}
                />
              )}
            </div>

            <div className="right-column">
              <Calendar
                ref={calendarRef}
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
        <p>{t('app.footer')}</p>
      </footer>
    </div>
  )
}

export default App
