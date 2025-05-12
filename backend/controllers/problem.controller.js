import { db } from "../src/libs/db.js";
export const createProblem = async (req, res) => { 
    const { title, description, difficulty, tags, constraints, example, testcases, codeSnippet, referenceSolutions, editorial, hints } = req.body;
    if (!req.user.role === "ADMIN") { 
        return res.status(403).json({
            success: false,
            message: "You are not authorized to create a problem",
        });
    }
    try {
        for (const [language, solutionCode] of Object.entries(referenceSolutions)) { 
            const languageId = getJudge0LanguageId(language);
            if (!languageId) { 
                return res.status(400).jsn({
                    success: false,
                    message:'language not supported',
                })
            }
            const submission = testcases.map(({ input, output }) =>( { 
                source_code: solutionCode,
                language_id: languageId,
                    stdin:input,
                    expected_output: output,
            }))
        }
    } catch (error) {
        
    }
};
export const getAllProblem = async (req, res) => {};
export const getProblemById = async (req, res) => {};
export const updateProblem = async (req, res) => {};
export const deleteProblem = async (req, res) => {};
export const getAllSolvedProblemByuser = async (req, res) => {};
