import { Schema, model, models } from "mongoose";

import { ISales, } from "@/lib/types";
import { MaterailEnum } from "../resource";


const salesSchema = new Schema({
    [MaterailEnum.MATERIAL_ID]: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    [MaterailEnum.PRICE]: {
        type: Number,
        required: true,
    },
    [MaterailEnum.QUANTITY]: {
        type:  Number,
        required: true,
    },
    [MaterailEnum.SELL_PRICE]: {
        type: Number,
        required: true,
    }


}, {
    timestamps: true,
})


const Sales = models.Sales || model<ISales>("Sales", salesSchema);

export default Sales;


