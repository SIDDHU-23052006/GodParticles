import React from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';

export const Orders: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2">Orders</h1>
        <p className="text-gray-600">Track invoices that have been ordered by other companies</p>
      </div>

      {/* Empty State */}
      <Card className="p-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📦</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
          <p className="text-gray-600 mb-6">
            Orders from other companies will appear here
          </p>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            Learn More
          </Button>
        </div>
      </Card>
    </div>
  );
};
