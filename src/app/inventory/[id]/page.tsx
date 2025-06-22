"use client";

import NewMaterialForm from '@/components/inventory/InventoryForm';
import React from 'react';
import { useSingleMaterialStore } from '@/lib/store/material';

interface InventoryPageProps {
    params: { id: string };
}

const InventoryPage: React.FC<InventoryPageProps> = ({ params }) => {
    const inventory = useSingleMaterialStore((state) => state.inventory);

    return (
        <div>
            <h1>Edit Inventory details</h1>
            <NewMaterialForm material={inventory} />
            {/* <p>Item ID: {params.id}</p> */}
        </div>
    );
};

export default InventoryPage;