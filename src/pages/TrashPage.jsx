import React from 'react';
import {DeleteLogsTable} from '../components/DeleteDialogs';
export default function TrashPage(){return <main className="dashboard"><div className="page-title"><div><p>OPERATIONS / TRASH</p><h1>Trash</h1><span>ReKYC requests deleted by admins, with who deleted them and why.</span></div></div>
 <div className="content-card"><DeleteLogsTable/></div></main>}
