import joi from "joi";
import { jobLocationEnum, seniorityLevelEnum, workingTimeEnum } from "../../common/utils/enum/enum.js";

export const addJobSchema = {
    body: joi.object({
        jobTitle : joi.string().min(2).max(50).required(),
        jobLocation : joi.string().valid(...Object.values(jobLocationEnum)),
        workingTime : joi.string().valid(...Object.values(workingTimeEnum)),
        seniorityLevel : joi.string().valid(...Object.values(seniorityLevelEnum)),
        jobDescription : joi.string(),
        technicalSkills : joi.array().items(joi.string()),
        softSkills : joi.array().items(joi.string()),
    })
}

