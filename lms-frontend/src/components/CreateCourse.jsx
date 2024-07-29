import React, { useState, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CloudinaryContext, Image } from 'cloudinary-react';
import { WidgetLoader, Widget } from 'react-cloudinary-upload-widget';

function CreateCoursePage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here (e.g., send data to backend)
        console.log({ title, description, content, uploadedImageUrl });
    };

    const handleImageUploadSuccess = useCallback((result) => {
        setUploadedImageUrl(result.info.secure_url);
        // Insert the image URL into the Quill editor
        const quill = document.querySelector('.ql-editor');
        const range = quill.ownerDocument.getSelection().getRangeAt(0);
        const img = document.createElement('img');
        img.src = result.info.secure_url;
        range.insertNode(img);
    }, []);

    return (
        <CloudinaryContext cloudName="dqebh4b5q">
            <div className="create-course-page">
                <h1>Create New Course</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="title">Title:</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="description">Description:</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="content">Content:</label>
                        <ReactQuill
                            theme="snow"
                            value={content}
                            onChange={setContent}
                            modules={{
                                toolbar: {
                                    container: [
                                        [{ 'header': [1, 2, false] }],
                                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                                        ['link', 'image'],
                                        ['clean']
                                    ],
                                },
                            }}
                        />
                    </div>
                    <div>
                        <label>Upload Image:</label>
                        <WidgetLoader />
                        <Widget
                            sources={['local', 'camera', 'url']}
                            resourceType={'image'}
                            cloudName={'dqebh4b5q'}
                            uploadPreset={'gtp-lms'}
                            buttonText={'Upload Image'}
                            style={{
                                color: 'white',
                                border: 'none',
                                width: '120px',
                                backgroundColor: '#1a73e8',
                                borderRadius: '4px',
                                height: '40px'
                            }}
                            folder={'course_images'}
                            cropping={false}
                            onSuccess={handleImageUploadSuccess}
                            onFailure={(err) => console.log(err)}
                            logging={false}
                            customPublicId={'sample'}
                            eager={'w_400,h_300,c_pad|w_260,h_200,c_crop'}
                            use_filename={true}
                        />
                    </div>
                    {uploadedImageUrl && (
                        <div>
                            <p>Uploaded Image:</p>
                            <Image publicId={uploadedImageUrl} width="300" crop="scale" />
                        </div>
                    )}
                    <button type="submit">Create Course</button>
                </form>
            </div>
        </CloudinaryContext>
    );
}

export default CreateCoursePage;