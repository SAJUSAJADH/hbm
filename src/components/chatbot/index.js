'use client'

import React, { useState } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'

function Chatbot() {
    const [show, setShow] = useState(false)
    const [query, setQuery] = useState('')
    const [messages, setMessages] = useState([
        { text: 'Hi, how can I help you today?', type: 'ai' }
    ])

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey)
    const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
      };
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: "Your an AI assitant of a jobportal webapp called Workwise. your name is workwise AI. if anyone ask other details than this jobapp or jobs, tell them that you cant assist them with that. Your job is to assist users to explore the website and provide solutions for the technical issues they  may face. your responses should be simple, commprise and understandable. Also assist them with app navigation providing navigation(don't say link) which are http://localhost:3000/, http://localhost:3000/account, http://localhost:3000/jobs(for posting jobs and applying jobs), http://localhost:3000/companies. if someone asked about a specic type of jobs, give them urls like http://localhost:3000/search/the type of job they asked."
      });

    const chat = async () => {
        const prompt = query;
        setMessages(prevMessages => [...prevMessages, { text: prompt, type: 'user' }])  
        setQuery('') 
        const chatSession = model.startChat({
            generationConfig,
            history: [],
          });
          const result = await chatSession.sendMessage(prompt);
          const text = await result.response.text() 
          setMessages(prevMessages => [...prevMessages, { text, type: 'ai' }])
    }

    return (
        <div>
            <button
                onClick={() => setShow(!show)}
                className="fixed bottom-4 right-4 inline-flex items-center justify-center text-sm font-medium disabled:pointer-events-none disabled:opacity-50 border rounded-full w-16 h-16 bg-black hover:bg-gray-700 m-0 cursor-pointer border-gray-200 bg-none p-0 normal-case leading-5 hover:text-gray-900"
                type="button" aria-haspopup="dialog" aria-expanded="false" data-state="closed">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="text-white block border-gray-200 align-middle">
                    <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" className="border-gray-200">
                    </path>
                </svg>
            </button>

            <div style={{
                boxShadow: '0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgba(0, 0, 0, 0.05)'
            }} className={`${!show && 'hidden'} fixed bottom-[calc(4rem+1.5rem)] overflow-y-auto right-0 mr-4 bg-white p-6 rounded-lg border border-[#e5e7eb] w-[440px] h-[634px]`}>

                <div className="flex flex-col space-y-1.5 pb-6">
                    <h2 className="font-semibold text-lg tracking-tight">AI Assistant</h2>
                    <p className="text-sm text-[#6b7280] leading-3">Powered by Workwise</p>
                </div>

                <div className="pr-4 h-[474px] overflow-y-auto" style={{ minWidth: '100%', display: 'table' }}>
                    {messages.map((message, index) => (
                        <div key={index} className={`flex gap-3 my-4 text-gray-600 text-sm flex-1 ${message.type === 'ai' ? 'items-start' : 'items-end justify-end'}`}>
                            <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
                                <div className="rounded-full bg-gray-100 border p-1">
                                    {message.type === 'ai' ? <svg stroke="none" fill="black" strokeWidth="1.5"
                                        viewBox="0 0 24 24" aria-hidden="true" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"></path>
                                    </svg>:
                                    <svg stroke="none" fill="black" stroke-width="0"
                                    viewBox="0 0 16 16" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                      d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z">
                                    </path>
                                  </svg>
                                    }
                                </div>
                            </span>
                            <p className="leading-relaxed"><span className="block font-bold text-gray-700">{message.type === 'ai' ? 'Workwise AI' : 'You'}</span> {message.text}</p>
                        </div>
                    ))}
                </div>

                <div className="flex items-center pt-0">
                    <form className="flex items-center justify-center w-full space-x-2" onSubmit={e => { e.preventDefault(); chat(); }}>
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-[#e5e7eb] px-3 py-2 text-sm placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-50 text-[#030712] focus-visible:ring-offset-2"
                            placeholder="Type your message" />
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium text-[#f9fafb] disabled:pointer-events-none disabled:opacity-50 bg-black hover:bg-[#111827E6] h-10 px-4 py-2">
                            Send
                        </button>
                    </form>
                </div>

            </div>
        </div>
    )
}

export default Chatbot
