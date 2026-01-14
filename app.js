import React, { useState, useEffect } from 'react';
import { Trash2, Plus, GraduationCap } from 'lucide-react';

export default function CollegeTracker() {
  const [colleges, setColleges] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    country: 'US',
    type: 'RD',
    status: 'pending',
    deadline: '',
    major: '',
    notes: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('colleges');
    if (saved) {
      setColleges(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('colleges', JSON.stringify(colleges));
  }, [colleges]);

  const applicationTypes = {
    US: ['RD', 'REA', 'ED', 'ED2', 'EA', 'Rolling'],
    UK: ['UCAS', 'Direct', 'Oxbridge', 'Rolling']
  };

  const statusColors = {
    pending: 'bg-gray-100 text-gray-700',
    accepted: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    deferred: 'bg-yellow-100 text-yellow-700',
    waitlisted: 'bg-blue-100 text-blue-700',
    withdrawn: 'bg-purple-100 text-purple-700'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setColleges([...colleges, { ...formData, id: Date.now() }]);
    setFormData({
      name: '',
      country: 'US',
      type: 'RD',
      status: 'pending',
      deadline: '',
      major: '',
      notes: ''
    });
    setShowForm(false);
  };

  const deleteCollege = (id) => {
    setColleges(colleges.filter(c => c.id !== id));
  };

  const updateStatus = (id, newStatus) => {
    setColleges(colleges.map(c => 
      c.id === id ? { ...c, status: newStatus } : c
    ));
  };

  const groupedColleges = colleges.reduce((acc, college) => {
    const key = `${college.country}-${college.type}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(college);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-800">College Application Tracker</h1>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              <Plus className="w-5 h-5" />
              Add College
            </button>
          </div>
        </header>

        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New College</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">College Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., Harvard University"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value, type: applicationTypes[e.target.value][0] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Application Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    {applicationTypes[formData.country].map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Major/Course</label>
                  <input
                    type="text"
                    value={formData.major}
                    onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Computer Science"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Stats, requirements, etc."
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Add College
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-6">
          {Object.keys(groupedColleges).length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No colleges added yet. Click "Add College" to get started!</p>
            </div>
          ) : (
            Object.entries(groupedColleges).map(([key, items]) => {
              const [country, type] = key.split('-');
              return (
                <div key={key} className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                    {country} - {type}
                  </h2>
                  <div className="space-y-3">
                    {items.map(college => (
                      <div key={college.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-gray-800">{college.name}</h3>
                            {college.major && (
                              <p className="text-sm text-gray-600 mt-1">Major: {college.major}</p>
                            )}
                            {college.deadline && (
                              <p className="text-sm text-gray-600">Deadline: {new Date(college.deadline).toLocaleDateString()}</p>
                            )}
                            {college.notes && (
                              <p className="text-sm text-gray-500 mt-2 italic">{college.notes}</p>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 ml-4">
                            <select
                              value={college.status}
                              onChange={(e) => updateStatus(college.id, e.target.value)}
                              className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[college.status]}`}
                            >
                              <option value="pending">Pending</option>
                              <option value="accepted">Accepted</option>
                              <option value="rejected">Rejected</option>
                              <option value="deferred">Deferred</option>
                              <option value="waitlisted">Waitlisted</option>
                              <option value="withdrawn">Withdrawn</option>
                            </select>
                            
                            <button
                              onClick={() => deleteCollege(college.id)}
                              className="text-red-500 hover:text-red-700 p-2"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
