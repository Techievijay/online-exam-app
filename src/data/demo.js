// GET: api/category
export const demoCategory = [
    {
      "id": 1,
      "title": "React",
      "questions": [

          {
            'id':1,
              "question": "What is React?",
              "options": ["Library", "Framework", "Language"],
              "correct":0
              
          },
          {
            'id':2,
              "question": "What is JSX?",
              "options": ["A markup language", "A JavaScript extension", "A CSS style"],
              "correct":1
              
          }
      ],
      "duration": 30
  },
  {
    "id": 2,
    "title": "JavaScript",
    "questions": [

        {
            "question": "Which function is used to serialize an object into a JSON string in JavaScript?",
            "options": ["stringify()", "parse()", "convert()", "None of the Above"],
            "correct": 0
        },
        {
            "question": "Which type of JavaScript language is ___?",
            "options": ["Object-Oriented", "Object-Based", "Assembly-language", "High-level"],
            "correct": 1
        },
        {
            "question": "Which one of the following is also known as a Conditional Expression?",
            "options": ["Alternative to if-else", "Switch statement", "If-then-else statement", "Immediate if"],
            "correct": 3
        },
    ],
    "duration": 30
}
]

 
 
 // POST : api/result
 const data =  [{

    "id": 1,
    'username':'john',
    "email":'john@g.com',
    "mediaURL":'https:/hehe/ncon',
    'result':[{'id':1, 'correct':0},{'id':2, 'correct':2}]

  }]