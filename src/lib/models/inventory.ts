import { Schema, model, models } from "mongoose";
import { IMaterial } from "../types";
import { MaterailEnum } from "../resource";


const MaterialSchema = new Schema({
    [MaterailEnum.MATERIAL_NAME]: {
        type: String,
        required: true,
        minlength: 3,
    },
    [MaterailEnum.PRICE]: {
        type: Number,
        required: true,
        min: 0,
    },
    [MaterailEnum.SELL_PRICE]: {
        type:  Number,
        required: true,
        min: 0,
    },
    [MaterailEnum.STOCK]: {
        type: Number,
        required: true,
        min: 0,
    },
    [MaterailEnum.STOCK_UNITS]: {
        type: String,
        enum: ["meters", "units"],
        required: true,
    },
    [MaterailEnum.CATEGORY]: {
        type: String,
        enum: ["plumber", "electrical", "carpentors"],
        required: true,
    },

}, {timestamps: true})

 const Material = models.Material || model<IMaterial>("Material", MaterialSchema);

 export default Material;