'use client';

import { useEffect, useState } from 'react';
import { useProjectTeamStore } from '../../../../stores/projectTeamStore';
import { ExecutionProgressBar } from '../../../../components/vendor/ExecutionProgressBar';
import { IssueTracker } from '../../../../components/vendor/IssueTracker';
import { TimelineView } from '../../../../components/Views/TimelineView';

// Mock list of items for tracking
const INITIAL_ITEMS = [
  { id: 'item-1', name: 'Oak Wood Bedframe (Master BR)', status: 'ORDERED' },
  { id: 'item-2', name: 'Velvet Sofa (Living Room)', status: 'PRODUCTION' },
  { id: 'item-3', name: 'Marble Dining Table', status: 'READY' },
  { id: 'item-4', name: 'Matte Black Kitchen Cabinets', status: 'DISPATCHED' },
  { id: 'item-5', name: 'Industrial Pendant Lights', status: 'DELIVERED' },
];

export default function ProjectExecutionPage({ params }: { params: { id: string } }) {
  const {
    progress,
    photos,
    members,
    fetchProgress,
    fetchPhotos,
    fetchMembers,
    uploadPhoto,
  } = useProjectTeamStore();

  const [items, setItems] = useState(INITIAL_ITEMS);
  const [photoRoom, setPhotoRoom] = useState('');
  const [photoCategory, setPhotoCategory] = useState('SITE_VISIT');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  useEffect(() => {
    fetchProgress(params.id);
    fetchPhotos(params.id);
    fetchMembers(params.id);
  }, [params.id, fetchProgress, fetchPhotos, fetchMembers]);

  // Recalculates progress locally or updates database progress
  const handleStatusChange = async (itemId: string, newStatus: string) => {
    const updatedItems = items.map((item) =>
      item.id === itemId ? { ...item, status: newStatus } : item
    );
    setItems(updatedItems);

    // Compute progress
    const map: Record<string, number> = {
      ORDERED: 10,
      PRODUCTION: 30,
      READY: 40,
      DISPATCHED: 50,
      DELIVERED: 75,
      INSTALLED: 100,
    };

    let total = 0;
    updatedItems.forEach((i) => {
      total += map[i.status] || 0;
    });
    const avg = Math.round(total / updatedItems.length);

    // Trigger API call to update the DB progress
    try {
      await fetch(`/api/projects/${params.id}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progress: avg, reason: `Updated item status` }),
      });
      // reload progress
      fetchProgress(params.id);
    } catch (e) {}
  };

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploadingPhoto(true);

    // Array of beautiful unsplash URLs based on category for rendering wow experience
    const unsplashPics = [
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace',
      'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e',
      'https://images.unsplash.com/photo-1617806118233-18e1db207f62',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7',
    ];
    const randomPic = unsplashPics[Math.floor(Math.random() * unsplashPics.length)];

    try {
      await uploadPhoto(params.id, {
        roomName: photoRoom,
        category: photoCategory,
        imageUrl: randomPic,
      });
      setPhotoRoom('');
    } catch (err) {}
    setIsUploadingPhoto(false);
  };

  // Maps timeline items for the Gantt Chart View
  const timelineResources = items.map((i) => ({
    id: i.id,
    title: i.name,
    status: i.status,
    createdAt: new Date(),
  }));

  return (
    <div className="p-8 bg-gray-50/50 min-h-screen space-y-8 select-none">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-800 tracking-tight">Project Execution Center</h1>
        <p className="text-xs text-gray-400 mt-1">
          Monitor construction milestones, items shipping status, and site visit photos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Progress, Timeline, and Item list */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Bar */}
          <ExecutionProgressBar progress={progress} status={progress < 40 ? 'DELAYED' : 'ON_TRACK'} />

          {/* Gantt Timeline */}
          <TimelineView resources={timelineResources} />

          {/* Item Tracking List */}
          <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-800 text-sm mb-4 uppercase tracking-wider">
              Item Sourcing & Installation
            </h3>
            <div className="overflow-hidden border border-gray-100 rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50 border-b border-gray-150">
                  <tr>
                    <th className="p-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Item Name
                    </th>
                    <th className="p-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Tracking Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-55">
                      <td className="p-3 font-semibold text-gray-700">{item.name}</td>
                      <td className="p-3">
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          className="bg-white border border-gray-200 rounded-lg p-1.5 font-bold text-[10px] text-gray-600 outline-none focus:ring-1 focus:ring-brand-500"
                        >
                          <option value="ORDERED">Ordered</option>
                          <option value="PRODUCTION">Production</option>
                          <option value="READY">Ready</option>
                          <option value="DISPATCHED">Dispatched</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="INSTALLED">Installed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Issues Tracker, Photo Uploads and Brief Team */}
        <div className="space-y-6">
          {/* Issue Tracker */}
          <IssueTracker projectId={params.id} />

          {/* Photo Gallery & Upload */}
          <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm space-y-5">
            <div>
              <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">
                Site Verification Photos
              </h3>
              <p className="text-[10px] text-gray-400 font-medium">Verify installation proof from the site.</p>
            </div>

            {/* Photo Stepper Form */}
            <form onSubmit={handleAddPhoto} className="space-y-3 p-3.5 bg-gray-50/70 rounded-xl border border-gray-150">
              <div>
                <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Context / Room
                </label>
                <input
                  type="text"
                  placeholder="Master Bedroom, Kitchen, etc."
                  value={photoRoom}
                  onChange={(e) => setPhotoRoom(e.target.value)}
                  required
                  className="w-full text-xs bg-white border border-gray-200 rounded-lg p-2 focus:ring-1 focus:ring-brand-500 outline-none font-semibold text-gray-700"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={photoCategory}
                  onChange={(e) => setPhotoCategory(e.target.value)}
                  className="w-full text-xs bg-white border border-gray-200 rounded-lg p-2 focus:ring-1 focus:ring-brand-500 outline-none font-bold text-gray-650"
                >
                  <option value="SITE_VISIT">Site Visit</option>
                  <option value="PRODUCTION_CHECK">Production Check</option>
                  <option value="DELIVERY">Delivery</option>
                  <option value="INSTALLATION">Installation</option>
                  <option value="FINAL_HANDOVER">Final Handover</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isUploadingPhoto}
                className="w-full py-2 bg-brand-600 hover:bg-brand-700 text-white text-[11px] font-bold rounded-xl transition-all shadow-sm"
              >
                {isUploadingPhoto ? 'Uploading...' : 'Add Verification Photo'}
              </button>
            </form>

            {/* Photos List Grid */}
            <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
              {photos.map((photo) => (
                <div key={photo.id} className="relative group rounded-xl overflow-hidden shadow-sm aspect-video border border-gray-100 bg-gray-50">
                  <img
                    src={photo.imageUrl}
                    alt={photo.roomName || 'Site Photo'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 text-white">
                    <span className="text-[10px] font-bold">{photo.roomName || 'Site'}</span>
                    <span className="text-[8px] opacity-75 font-semibold uppercase">{photo.category}</span>
                  </div>
                </div>
              ))}

              {photos.length === 0 && (
                <div className="col-span-2 text-center py-6 text-gray-400 text-xs font-semibold">
                  No site photos yet.
                </div>
              )}
            </div>
          </div>

          {/* Active Team Brief */}
          <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-800 text-sm mb-4 uppercase tracking-wider">
              Project Team
            </h3>
            <div className="space-y-3">
              {members.slice(0, 3).map((member) => (
                <div key={member.id} className="flex items-center space-x-3">
                  <img
                    src={
                      member.user?.avatarUrl ||
                      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
                    }
                    className="w-7 h-7 rounded-full object-cover border border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-gray-800 truncate">
                      {member.user?.name}
                    </div>
                    <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{member.role}</div>
                  </div>
                </div>
              ))}
              {members.length === 0 && (
                <div className="text-center py-2 text-gray-400 text-xs font-semibold">
                  No team assigned.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
