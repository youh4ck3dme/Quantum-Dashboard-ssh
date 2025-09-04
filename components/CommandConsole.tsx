import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ControlPanel } from './ControlPanel';
import type { AIModel, Job } from '../types';
import { JobStatus } from '../types';

interface CommandConsoleProps {
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
  jobs: Job[];
  models: AIModel[];
  isAuthenticated: boolean;
}

const WelcomeBanner: React.FC = () => (
    <pre className="text-quantum-cyan text-xs whitespace-pre-wrap font-mono">
{`
 ██████╗ ██╗   ██╗ █████╗ ███╗   ██╗████████╗███╗   ███╗
██╔═══██╗██║   ██║██╔══██╗████╗  ██║╚══██╔══╝████╗ ████║
██║   ██║██║   ██║███████║██╔██╗ ██║   ██║   ██╔████╔██║
██║   ██║██║   ██║██╔══██║██║╚██╗██║   ██║   ██║╚██╔╝██║
╚██████╔╝╚██████╔╝██║  ██║██║ ╚████║   ██║   ██║ ╚═╝ ██║
 ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚═╝     ╚═╝
`}
<span className="text-gray-300">Quantum AI Command Console v2.0 Initialized.</span>
<span className="text-gray-400">Type 'help' for a list of available commands.</span>
</pre>
);


export const CommandConsole: React.FC<CommandConsoleProps> = ({ setJobs, jobs, models, isAuthenticated }) => {
    const [input, setInput] = useState<string>('');
    const [output, setOutput] = useState<React.ReactNode[]>([]);
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    
    const inputRef = useRef<HTMLInputElement>(null);
    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        setOutput([<WelcomeBanner key="welcome" />]);
        inputRef.current?.focus();
    }, []);

    useEffect(scrollToBottom, [output]);

    const executeCommand = useCallback((commandStr: string) => {
        const [command, ...args] = commandStr.trim().split(/\s+/);
        if (!command) return;

        let response: React.ReactNode;

        const commandDefinition = commands[command.toLowerCase()];

        if (commandDefinition) {
            response = commandDefinition.execute(args, { setJobs, jobs, models, isAuthenticated });
        } else {
            response = <span className="text-red-400">Command not found: "{command}". Type "help".</span>;
        }

        setOutput(prev => [...prev, <Prompt command={commandStr} />, response]);

    }, [jobs, models, isAuthenticated, setJobs]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const command = input.trim();
            if (command) {
                executeCommand(command);
                setHistory(prev => [command, ...prev]);
                setHistoryIndex(-1);
            } else {
                 setOutput(prev => [...prev, <Prompt command="" />]);
            }
            setInput('');
        } else if (e.key === 'ArrowUp') {
             e.preventDefault();
            if (historyIndex < history.length - 1) {
                const newIndex = historyIndex + 1;
                setHistoryIndex(newIndex);
                setInput(history[newIndex]);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setInput(history[newIndex]);
            } else {
                setHistoryIndex(-1);
                setInput('');
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            const matchingCommands = Object.keys(commands).filter(c => c.startsWith(input.toLowerCase()));
            if (matchingCommands.length === 1) {
                setInput(matchingCommands[0]);
            } else if (matchingCommands.length > 1) {
                const response = <span className="text-yellow-400">{matchingCommands.join('   ')}</span>
                setOutput(prev => [...prev, <Prompt command={input} />, response]);
            }
        }
    };
    
    const commands: { [key: string]: Command } = {
        help: {
            description: 'Displays a list of all available commands.',
            execute: () => (
                <div>
                    <p className="text-quantum-cyan font-bold mb-2">Available Commands:</p>
                    <ul className="space-y-1 text-sm">
                        {Object.entries(commands).map(([name, { description, usage }]) => (
                           <li key={name}>
                               <span className="font-bold text-green-400 w-24 inline-block">{name}</span> 
                               <span className="text-gray-400 italic mr-2">{usage || ''}</span>
                               - {description}
                           </li>
                        ))}
                    </ul>
                </div>
            )
        },
        clear: {
            description: 'Clears the console screen.',
            execute: () => {
                setOutput([]);
                return null;
            }
        },
        welcome: {
            description: 'Displays the welcome banner.',
            execute: () => <WelcomeBanner />
        },
        deploy: {
            description: 'Deploys an AI model to a quantum backend.',
            usage: '<model_name>',
            execute: (args, { setJobs, models, isAuthenticated }) => {
                if (!isAuthenticated) return <span className="text-red-400">Authentication required. Please connect with your API Token first.</span>;
                if (args.length === 0) return <span className="text-yellow-400">Usage: deploy &lt;model_name&gt;</span>;
                
                const modelName = args[0];
                const model = models.find(m => m.name === modelName);
                
                if (!model) return <span className="text-red-400">Error: Model '{modelName}' not found in repository.</span>;

                const newJob: Job = {
                    id: `cq${Math.random().toString(36).substring(2, 12)}`,
                    model: model.name,
                    backend: 'ibm_brisbane',
                    status: JobStatus.Pending,
                    submitted: 'Just now',
                };
                setJobs(prev => [newJob, ...prev]);

                return <span className="text-green-400">Successfully submitted job {newJob.id} to deploy model '{model.name}'.</span>;
            }
        },
        jobs: {
            description: 'Lists all current and recent jobs.',
            execute: (args, { jobs }) => (
                <div className="w-full text-sm">
                    <div className="flex font-bold border-b border-quantum-border/50 pb-1">
                       <span className="w-1/4">JOB ID</span>
                       <span className="w-1/2">MODEL</span>
                       <span className="w-1/4">STATUS</span>
                    </div>
                    {jobs.map(job => (
                        <div key={job.id} className="flex py-1 border-b border-quantum-border/20">
                           <span className="w-1/4">{job.id}</span>
                           <span className="w-1/2 text-quantum-cyan text-xs">{job.model}</span>
                           <span className="w-1/4">
                             <span className={`px-2 py-0.5 rounded-full text-xs ${
                                job.status === JobStatus.Completed ? 'bg-green-500/20 text-green-300' :
                                job.status === JobStatus.Running ? 'bg-blue-500/20 text-blue-300 animate-pulse' :
                                job.status === JobStatus.Pending ? 'bg-yellow-500/20 text-yellow-300' : 'bg-red-500/20 text-red-300'
                             }`}>{job.status}</span>
                           </span>
                        </div>
                    ))}
                </div>
            )
        },
        status: {
            description: 'Gets the status of a specific job.',
            usage: '<job_id>',
             execute: (args, { jobs }) => {
                if (args.length === 0) return <span className="text-yellow-400">Usage: status &lt;job_id&gt;</span>;
                const jobId = args[0];
                const job = jobs.find(j => j.id === jobId);

                if (!job) return <span className="text-red-400">Error: Job '{jobId}' not found.</span>;

                return (
                    <div>
                        <p><span className="font-bold text-gray-400 w-28 inline-block">Job ID:</span> {job.id}</p>
                        <p><span className="font-bold text-gray-400 w-28 inline-block">Model:</span> {job.model}</p>
                        <p><span className="font-bold text-gray-400 w-28 inline-block">Backend:</span> {job.backend}</p>
                        <p><span className="font-bold text-gray-400 w-28 inline-block">Submitted:</span> {job.submitted}</p>
                        <p><span className="font-bold text-gray-400 w-28 inline-block">Status:</span> 
                           <span className={`font-bold ${
                                job.status === JobStatus.Completed ? 'text-green-400' :
                                job.status === JobStatus.Running ? 'text-blue-400 animate-pulse' :
                                job.status === JobStatus.Pending ? 'text-yellow-400' : 'text-red-400'
                            }`}>{job.status}</span>
                        </p>
                    </div>
                );
            }
        },
    };


    return (
        <ControlPanel title="Command Console">
            <div className="bg-quantum-dark h-full flex flex-col font-mono text-sm rounded-md p-2 border border-quantum-border/50" onClick={() => inputRef.current?.focus()}>
                <div className="flex-grow overflow-y-auto pr-2">
                    {output.map((line, index) => (
                        <div key={index} className="py-0.5">{line}</div>
                    ))}
                    <div ref={endOfMessagesRef} />
                </div>
                <div className="flex items-center mt-2 border-t border-quantum-border/50 pt-2">
                    <Prompt command="" isInput />
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        className="bg-transparent w-full focus:outline-none flex-1"
                        autoFocus
                    />
                     <div className="w-2 h-4 border-l-2 border-current animate-blink"></div>
                </div>
            </div>
        </ControlPanel>
    );
};

interface PromptProps {
    command: string;
    isInput?: boolean;
}

const Prompt: React.FC<PromptProps> = ({ command, isInput = false }) => (
     <div className={`flex-shrink-0 ${isInput ? '' : 'flex'}`}>
        <span className="text-green-400">user@qcc</span>
        <span className="text-gray-500">:</span>
        <span className="text-blue-400">~$</span>
        <span className="ml-2">{isInput ? null : command}</span>
    </div>
);

interface CommandContext {
    setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
    jobs: Job[];
    models: AIModel[];
    isAuthenticated: boolean;
}

interface Command {
    description: string;
    usage?: string;
    execute: (args: string[], context: CommandContext) => React.ReactNode;
}
