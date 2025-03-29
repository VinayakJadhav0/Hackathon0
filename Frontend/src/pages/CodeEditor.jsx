import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { Button } from '@mui/material';
import axios from 'axios';
import server from '../environment'; // Make sure the server URL is correct

const client = axios.create({
  baseURL: `${server}`,  // Ensure the correct baseURL is set
});

const CodeEditor = () => {
  const [code, setCode] = useState('// Start coding...');
  
  // Handle code change in editor
  const handleEditorChange = (value) => {
    setCode(value);
  };

  // Handle Run button click to send the code to the backend
  const handleRun = async () => {
    try {
        console.log("hello")
      const response = await client.post('/run-code', { code});
      console.log('Output:', response.data);  // Log the result from the server
    } catch (error) {
      console.error('Error executing code:', error);
    }
  };

  return (
    <div className="w-full h-full p-4">
      <CodeMirror
        value={code}
        height="300px"
        theme={oneDark}
        extensions={[javascript(), python()]}
        onChange={handleEditorChange}
        className="w-full border rounded-xl shadow-md p-2 bg-gray-100"
      />
      <Button onClick={handleRun} variant="contained" color="primary" className="mt-4">
        Run
      </Button>
    </div>
  );
};

export default CodeEditor;
