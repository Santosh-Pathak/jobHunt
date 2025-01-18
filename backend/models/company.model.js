import mongoose0     from "mongoose";
 const CompanySchema = new mongoose0.Schema({

    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    website: {
        type: String,
    },
    location: {
        type: String,
    },
    logo: {
        type: String, // URL to company logo
    },
    userId: {
        type: mongoose0.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

 },{timestamps: true});

 export default Company = mongoose.model("Company", CompanySchema);