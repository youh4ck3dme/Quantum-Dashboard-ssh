import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ControlPanel } from './ControlPanel';

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

export const SSHTerminal: React.FC = () => {
    const [ip, setIp] = useState('192.168.1.101');
    const [user, setUser] = useState('quantum_admin');
    const [password, setPassword] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [output, setOutput] = useState<string[]>([]);
    const [input, setInput] = useState('');
    const endOfMessagesRef = useRef<null | HTMLDivElement>(null);
    const inputRef = useRef<null | HTMLInputElement>(null);

    const handleConnect = useCallback(() => {
        if (!ip || !user) {
            alert('Please provide IP Address and Username.');
            return;
        }
        setIsConnecting(true);
        setOutput(['Attempting to connect to ' + ip + '...']);
        setTimeout(() => {
            setIsConnecting(false);
            setIsConnected(true);
            setOutput([
                'Authenticating with public key "rsa-key-20240101"...',
                'Welcome to Ubuntu 22.04.3 LTS (GNU/Linux 5.15.0-78-generic x86_64)',
                'Last login: ' + new Date().toString(),
            ]);
        }, 1500);
    }, [ip, user]);

    useEffect(() => {
        // Automatically attempt to connect on mount if details are present.
        handleConnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only on component mount.


    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [output]);

    useEffect(() => {
        if (isConnected) {
            inputRef.current?.focus();
        }
    }, [isConnected]);

    const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const command = input.trim();
            if (command === '') return;

            const prompt = `${user}@${ip}:~$`;
            let newOutput = [...output, `${prompt} ${command}`];

            switch (command.toLowerCase()) {
                case 'ls -la':
                    newOutput.push(
`total 24
drwxr-xr-x 4 ${user} ${user} 4096 Jul 29 11:00 .
drwxr-xr-x 3 root root 4096 Jul 29 10:55 ..
-rw-r--r-- 1 ${user} ${user} 220 Jul 29 10:55 .bash_logout
-rw-r--r-- 1 ${user} ${user} 3771 Jul 29 10:55 .bashrc
drwx------ 2 ${user} ${user} 4096 Jul 29 10:55 .ssh
-rw-r--r-- 1 ${user} ${user} 807 Jul 29 10:55 .profile`
                    );
                    break;
                case 'ls':
                    newOutput.push('models/  scripts/  data/  README.md');
                    break;
                case 'whoami':
                    newOutput.push(user);
                    break;
                case 'pwd':
                    newOutput.push(`/home/${user}`);
                    break;
                case 'exit':
                    newOutput.push('logout');
                    setTimeout(() => {
                        setIsConnected(false);
                        setPassword('');
                        setInput('');
                        setOutput([]);
                    }, 500);
                    break;
                case 'clear':
                    newOutput = [];
                    break;
                default:
                    newOutput.push(`-bash: ${command}: command not found`);
                    break;
            }
            setOutput(newOutput);
            setInput('');
        }
    };

    const renderConnectionForm = () => (
        <div className="flex flex-col space-y-4 p-4 font-mono">
            <p className="text-sm text-gray-400">Establish secure connection to your Virtual Private Server.</p>
            <div>
                <label className="text-xs text-quantum-cyan">IP Address</label>
                <input
                    type="text"
                    value={ip}
                    onChange={(e) => setIp(e.target.value)}
                    className="w-full bg-quantum-dark border border-quantum-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-quantum-blue mt-1"
                />
            </div>
            <div>
                <label className="text-xs text-quantum-cyan">Username</label>
                <input
                    type="text"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    className="w-full bg-quantum-dark border border-quantum-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-quantum-blue mt-1"
                />
            </div>
            <div>
                <label className="text-xs text-quantum-cyan">Password / Key</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Using public key auth..."
                    className="w-full bg-quantum-dark border border-quantum-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-quantum-blue mt-1"
                />
            </div>
            <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="w-full flex items-center justify-center bg-quantum-blue hover:bg-quantum-cyan hover:text-quantum-dark text-white font-bold py-2 px-4 rounded transition disabled:opacity-50 disabled:cursor-wait"
            >
                <LockIcon />
                <span className="ml-2">{isConnecting ? 'Connecting...' : 'Secure Connect'}</span>
            </button>
             {isConnecting && <div className="text-center text-yellow-400 text-xs animate-pulse">{output[0]}</div>}
        </div>
    );

    const renderTerminal = () => (
        <div className="bg-quantum-dark h-full flex flex-col font-mono text-sm rounded-md p-2 border border-quantum-border/50" onClick={() => inputRef.current?.focus()}>
            <div className="flex-grow overflow-y-auto pr-2">
                {output.map((line, index) => (
                    <p key={index} className="whitespace-pre-wrap text-gray-300 leading-tight">
                       {line}
                    </p>
                ))}
                <div ref={endOfMessagesRef} />
            </div>
            <div className="flex items-center mt-2 pt-2">
                <span className="text-green-400">{user}@{ip}:~$</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleCommand}
                    className="bg-transparent w-full focus:outline-none ml-2 text-gray-200"
                    autoFocus
                />
            </div>
        </div>
    );

    return (
        <ControlPanel title="Secure Shell (SSH) Terminal">
            {!isConnected ? renderConnectionForm() : renderTerminal()}
        </ControlPanel>
    );
};
