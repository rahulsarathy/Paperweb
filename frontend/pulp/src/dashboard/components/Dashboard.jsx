import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from 'react-router-dom'

import LoadingBar from './LoadingBar'
import Header from './Header'
import Sidebar from './Sidebar'

import ReadingListView from './ReadingListView'
// import ArchiveView from './ArchiveView'
import SettingsView from './SettingsView'
// import PaymentsView from './PaymentsView'
// import DeliveryView from './DeliveryView'

import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.scss'

function Dashboard(props) {
    return (
        <Router basename="/testing">
            <Header />
            <LoadingBar />

            <Sidebar />

            <div className="content">
                <Switch>
                    <Route path="/reading_list">
                        <ReadingListView />
                    </Route>
                    {/* <Route path="/archive">
                        <ArchiveView />
                    </Route>*/}
                    <Route path="/settings">
                        <SettingsView />
                    </Route>
                    {/*<Route path="/payments">
                        <PaymentsView />
                    </Route>
                    <Route path="/delivery">
                        <DeliveryView />
                    </Route> */}
                </Switch>
            </div>
        </Router>
    )
}

export default Dashboard
