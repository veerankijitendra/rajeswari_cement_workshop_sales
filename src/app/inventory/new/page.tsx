import React from 'react';
import NewMaterialForm from '@/components/inventory/InventoryForm';

const NewInventoryPage: React.FC = () => {
    return (
        <div>
            <h1>Add New Inventory Item</h1>
            <NewMaterialForm />
        </div>
    );
};

export default NewInventoryPage;