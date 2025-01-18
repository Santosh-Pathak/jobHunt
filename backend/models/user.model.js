import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber :{
        type: Number,
        required: true
    }
    ,
    password: {
        type: String,
        required: true
    },
    role:{
        type: String,
        enum:['student','recruiter'], // we have only two/more roles in our system so we use enum to restrict the value of role to only student or recruiter 
        required: true,
        default:'student',
    },
    profile:{
        bio: {
            type: String,
            default: 'Bio is empty',
            skills :[{type: String}],
            resume :{type: String}, // URL to resume File
            resumeOrignialName :{type: String}, // Original Name of resume file
            company :{type: moongoose.Schema.Types.ObjectId, 
            ref: 'Company'}, // Company ID
            profilePhoto :{type: String,
                default:""
            }, // URL to profile photo
        },
    }
    }, {timestamps: true});

     export const User = mongoose.model('User', userSchema);