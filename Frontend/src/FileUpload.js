



// import React, { useState } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";

// const FileUpload = () => {
//   const [file, setFile] = useState(null);
//   const [question, setQuestion] = useState("");
//   const [response, setResponse] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleFileChange = (event) => {
//     setFile(event.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       alert("Please select a file");
//       return;
//     }
//     setLoading(true);
//     const formData = new FormData();
//     formData.append("pdf", file);

//     try {
//       const { data } = await axios.post("http://localhost:5000/extract-text", formData);
//       setResponse(data.text);
//     } catch (error) {
//       console.error("Error uploading file:", error);
//     }
//     setLoading(false);
//   };

//   const handleQuestionSubmit = async () => {
//     if (!question || !response) {
//       alert("Please upload a file and enter a question");
//       return;
//     }
//     setLoading(true);

//     try {
//       const { data } = await axios.post("http://localhost:5000/process-text", {
//         context: response,
//         question: question,
//       });
//       setResponse(data.answer);
//     } catch (error) {
//       console.error("Error processing question:", error);
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
//       <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg text-center">
//         <div className="flex justify-center  "><h2 className="text-2xl font-semibold mb-4 text-gray-800">Ai Reader</h2>

//         </div>
//         <input
//           type="file"
//           accept="application/pdf"
//           onChange={handleFileChange}
//           className="mb-4 p-2 border rounded w-full"
//         />
//         <button
//           onClick={handleUpload}
//           className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
//         >
//           Upload & Extract Text
//         </button>

//         <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">Ask a Question</h2>
//         <input
//           type="text"
//           value={question}
//           onChange={(e) => setQuestion(e.target.value)}
//           placeholder="Enter your question"
//           className="mb-4 p-2 border rounded w-full"
//         />
//         <button
//           onClick={handleQuestionSubmit}
//           className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
//         >
//           Get Answer
//         </button>

//         {loading && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 1 }}
//             className="text-lg font-semibold text-gray-600 mt-4"
//           >
//             Generating response...
//           </motion.div>
//         )}

//         {response && !loading && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="mt-6 p-4 bg-gray-200 rounded-lg text-gray-800"
//           >
//             <h3 className="text-lg font-semibold">Response:</h3>
//             <p className="mt-2">{response}</p>
//           </motion.div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FileUpload;






import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [extractedText, setExtractedText] = useState("");
    const [userQuestion, setUserQuestion] = useState("");
    const [response, setResponse] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('pdf', file);  // Field name = 'pdf'

        try {
            const result = await axios.post("http://localhost:5000/extract-text", formData);
            setExtractedText(result.data.text);
        } catch (error) {
            console.error("Error extracting text:", error);
        }
    };

    const handleQuestionSubmit = async () => {
        if (!extractedText || !userQuestion) return;

        setIsLoading(true);
        try {
            const result = await axios.post("http://localhost:5000/process-text", {
                context: extractedText,
                question: userQuestion,
            });

            setResponse(result.data.answer);
        } catch (error) {
            console.error("Error processing question:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 p-6 flex flex-col items-center justify-center">
            <motion.div
                className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold text-center text-purple-700 mb-6">Document Q&A Chatbot</h1>

                <input
                    type="file"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 mb-4"
                />
                <button
                    onClick={handleUpload}
                    className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors mb-4"
                >
                    Extract Text
                </button>

                {extractedText && (
                    <div className="mb-4">
                        <textarea
                            value={userQuestion}
                            onChange={(e) => setUserQuestion(e.target.value)}
                            placeholder="Enter your question here..."
                            className="w-full p-4 border border-gray-300 bg-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                            rows={3}
                        ></textarea>
                        <button
                            onClick={handleQuestionSubmit}
                            className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors mt-2"
                        >
                            {isLoading ? "Generating..." : "Get Answer"}
                        </button>
                    </div>
                )}

                {response && (
                    <motion.div
                        className="bg-gray-100 p-4 rounded-xl mt-4 whitespace-pre-line"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-lg font-semibold text-purple-700 mb-2">Response:</h2>
                        <motion.p
                            className="text-gray-800"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 1 }}
                        >
                            {response}
                        </motion.p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default FileUpload;
