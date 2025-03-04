import React, { useState } from 'react'; // Add useState
import { useParams, useNavigate } from 'react-router-dom'; // Add useNavigate
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../context/AuthContext'; // Add this line
import axios from 'axios';

function ApplyJob() {
    const { id } = useParams(); // Job ID from the URL
    const { token } = useAuth(); // Use token from AuthContext
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [file, setFile] = useState(null);

    const { getRootProps, getInputProps } = useDropzone({
        accept: 'application/pdf,application/doc,application/docx', // Accept PDF, DOC, DOCX
        onDrop: acceptedFiles => {
            setFile(acceptedFiles[0]);
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please upload a resume');
            return;
        }

        const formData = new FormData();
        formData.append('resume', file);
        formData.append('jobId', id);

        try {
            await axios.post('/api/applications', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate('/candidate/dashboard');
        } catch (error) {
            setError(error.response.data.message || 'Failed to apply for job');
        }
    };

    return (
        <div>
            <h2>Apply for Job - HireHub</h2>
            <p>Apply for the job you selected.</p>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>Drag 'n' drop a resume here, or click to select a file (PDF, DOC, DOCX)</p>
                    {file && <p>Selected file: {file.name}</p>}
                </div>
                <button type="submit">Submit Application</button>
            </form>
        </div>
    );
}

export default ApplyJob;