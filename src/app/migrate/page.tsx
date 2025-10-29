'use client';

export default function MigratePage() {
  const runMigration = async () => {
    try {
      const response = await fetch('/api/migrate-beta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      alert(JSON.stringify(data, null, 2));
    } catch (error) {
      alert('Error: ' + error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Database Migration</h1>
        <button 
          onClick={runMigration}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Run Beta Tables Migration
        </button>
      </div>
    </div>
  );
}