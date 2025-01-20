import React, { useState, useRef } from 'react';

const ChatCompletion = () => {
    const [response, setResponse] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const abortControllerRef = useRef(null);

    const startStreaming = async () => {
        if (isStreaming) return;

        setIsStreaming(true);
        setResponse(''); // Clear previous response

        abortControllerRef.current = new AbortController();

        try {
            const res = await fetch('http://localhost:5556/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ /* your request payload */ }),
                signal: abortControllerRef.current.signal,
            });

            if (!res.ok) {
                throw new Error('Network response was not ok');
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let done = false;

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                const chunk = decoder.decode(value, { stream: true });
                const data = JSON.parse(chunk);
                if (data.choices && data.choices[0].delta.content) {
                    setResponse((prev) => prev + " " + data.choices[0].delta.content);
                }
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('Fetch aborted');
            } else {
                console.error('Error occurred while receiving the stream.', error);
            }
        } finally {
            setIsStreaming(false);
        }
    };

    const stopStreaming = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
    };

    return (
        <div className="container">
            <button onClick={startStreaming} disabled={isStreaming}>
                Start Streaming
            </button>
            <button onClick={stopStreaming} disabled={!isStreaming}>
                Stop Streaming
            </button>
            <textarea value={response} readOnly />
        </div>
    );
};

export default ChatCompletion;