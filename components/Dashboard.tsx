
import React, { useState, useCallback } from 'react';
import { ControlPanel } from './ControlPanel';
import { CommandConsole } from './CommandConsole';
import { StatusIndicator } from './StatusIndicator';
import { BackendStatusChart } from './BackendStatusChart';
import { SSHTerminal } from './SSHTerminal';
import type { AIModel, Job } from '../types';
import { JobStatus, Status } from '../types';
import { MODELS, BACKENDS, INITIAL_JOBS, HackedAiArmyLogo } from '../constants';
import { CheckCircleIcon, XCircleIcon } from '../constants';


export const Dashboard: React.FC = () => {
    const [apiToken, setApiToken] = useState<string>('');
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);

    const handleConnect = useCallback(() => {
        if (apiToken.trim() !== '') {
            setIsAuthenticated(true);
        } else {
            alert('Please enter an API Token.');
        }
    }, [apiToken]);

    const handleDeploy = useCallback((model: AIModel) => {
        if (!isAuthenticated) {
            alert('Authentication required. Please connect with your API Token first.');
            return;
        }
        const newJob: Job = {
            id: `cq${Math.random().toString(36).substring(2, 12)}`,
            model: model.name,
            backend: 'ibm_brisbane',
            status: JobStatus.Pending,
            submitted: 'Just now',
        };
        setJobs(prevJobs => [newJob, ...prevJobs]);
    }, [isAuthenticated]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-1 flex flex-col gap-6">
                <ControlPanel title="Authentication & Status">
                    <div className="flex flex-col space-y-4">
                        <p className="text-sm text-gray-400">Enter your IBM Quantum API Token to connect.</p>
                        <div className="flex items-center space-x-2">
                            <input
                                type="password"
                                value={apiToken}
                                onChange={(e) => setApiToken(e.target.value)}
                                placeholder="***********************************"
                                className="flex-grow bg-quantum-dark border border-quantum-border rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-quantum-blue"
                            />
                            <button
                                onClick={handleConnect}
                                className={`px-4 py-2 rounded text-sm font-bold transition-all ${isAuthenticated ? 'bg-green-600 cursor-not-allowed' : 'bg-quantum-blue hover:bg-quantum-cyan hover:text-quantum-dark'}`}
                                disabled={isAuthenticated}
                            >
                                {isAuthenticated ? 'Connected' : 'Connect'}
                            </button>
                        </div>
                        <StatusIndicator label="Connection Status" success={isAuthenticated} />
                    </div>
                </ControlPanel>
                
                <ControlPanel title="Model Repository">
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {MODELS.map(model => (
                            <div key={model.name} className="bg-quantum-dark p-3 rounded-md border border-quantum-border">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className="font-bold font-mono text-quantum-cyan">{model.name}</h4>
                                        <p className="text-xs text-gray-400">{model.description}</p>
                                    </div>
                                    <button onClick={() => handleDeploy(model)} className="bg-quantum-purple hover:opacity-80 text-white text-xs font-bold py-1 px-3 rounded transition" disabled={!isAuthenticated}>
                                        Deploy
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </ControlPanel>

            </div>

            {/* Middle Column */}
            <div className="lg:col-span-1 flex flex-col gap-6">
                <ControlPanel title="Quantum Backend Status">
                   <div className="flex flex-col h-full">
                        <div>
                            <div className="space-y-4">
                               {BACKENDS.map(backend => (
                                   <div key={backend.name} className="flex items-center justify-between text-sm">
                                       <span className="font-mono">{backend.name}</span>
                                       <div className="flex items-center space-x-2">
                                           <span className={`px-2 py-0.5 rounded-full text-xs ${
                                               backend.status === Status.Online ? 'bg-green-500/20 text-green-300' :
                                               backend.status === Status.Calibrating ? 'bg-yellow-500/20 text-yellow-300' : 'bg-red-500/20 text-red-300'
                                           }`}>{backend.status}</span>
                                           <span>Q: {backend.queue}</span>
                                       </div>
                                   </div>
                               ))}
                            </div>
                            <div className="mt-4 h-40">
                                <BackendStatusChart backends={BACKENDS} />
                            </div>
                        </div>
                        <div className="flex justify-center items-center pt-2 mt-auto border-t border-quantum-border/30">
                            <div className="w-20 opacity-70">
                                <HackedAiArmyLogo />
                            </div>
                        </div>
                   </div>
                </ControlPanel>
                 <ControlPanel title="Job Monitor">
                    <div className="flex flex-col h-full">
                        <div className="flex-grow max-h-96 overflow-y-auto pr-2">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-quantum-border text-gray-400">
                                        <th className="py-2">Job ID</th>
                                        <th className="py-2">Model</th>
                                        <th className="py-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="font-mono">
                                    {jobs.map(job => (
                                        <tr key={job.id} className="border-b border-quantum-border/50">
                                            <td className="py-2">{job.id}</td>
                                            <td className="py-2 text-quantum-cyan text-xs">{job.model}</td>
                                            <td className="py-2">
                                                <span className={`px-2 py-0.5 rounded-full text-xs ${
                                                    job.status === JobStatus.Completed ? 'bg-green-500/20 text-green-300' :
                                                    job.status === JobStatus.Running ? 'bg-blue-500/20 text-blue-300 animate-pulse' :
                                                    job.status === JobStatus.Pending ? 'bg-yellow-500/20 text-yellow-300' : 'bg-red-500/20 text-red-300'
                                                }`}>{job.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-center items-center pt-2 mt-auto border-t border-quantum-border/30">
                            <div className="w-20 opacity-70">
                                <HackedAiArmyLogo />
                            </div>
                        </div>
                    </div>
                </ControlPanel>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-1 flex flex-col gap-6">
                <CommandConsole setJobs={setJobs} jobs={jobs} models={MODELS} isAuthenticated={isAuthenticated}/>
                <SSHTerminal />
            </div>
        </div>
    );
};
