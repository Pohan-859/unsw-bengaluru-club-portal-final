"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface EditProfileFormProps {
  initialData: {
    bio: string | null;
    major: string | null;
    gradYear: number | null;
    isProfilePublic: boolean;
  };
}

export default function EditProfileForm({ initialData }: EditProfileFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    bio: initialData.bio || '',
    major: initialData.major || '',
    gradYear: initialData.gradYear?.toString() || '',
    isProfilePublic: initialData.isProfilePublic,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bio: formData.bio,
          major: formData.major,
          gradYear: formData.gradYear ? parseInt(formData.gradYear, 10) : null,
          isProfilePublic: formData.isProfilePublic,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text() || 'Failed to update profile');
      }

      setSuccess(true);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-2 border-unsw-charcoal bg-white p-6 shadow-brutal max-w-2xl">
      <h2 className="font-display text-2xl font-bold mb-6">Edit Profile</h2>
      
      {success && (
        <div className="mb-6 p-4 bg-status-approved/20 border-2 border-status-approved text-status-approved font-mono">
          Profile updated successfully!
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 border-2 border-red-500 text-red-700 font-mono">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block font-mono text-sm font-bold mb-2">Major</label>
          <input
            type="text"
            value={formData.major}
            onChange={(e) => setFormData({ ...formData, major: e.target.value })}
            className="w-full border-2 border-unsw-charcoal p-3 font-body focus:outline-none focus:ring-2 focus:ring-unsw-yellow shadow-[2px_2px_0_0_#231F20]"
            placeholder="e.g. Computer Science"
          />
        </div>

        <div>
          <label className="block font-mono text-sm font-bold mb-2">Graduation Year</label>
          <input
            type="number"
            min="2020"
            max="2035"
            value={formData.gradYear}
            onChange={(e) => setFormData({ ...formData, gradYear: e.target.value })}
            className="w-full border-2 border-unsw-charcoal p-3 font-body focus:outline-none focus:ring-2 focus:ring-unsw-yellow shadow-[2px_2px_0_0_#231F20]"
            placeholder="e.g. 2025"
          />
        </div>

        <div>
          <label className="block font-mono text-sm font-bold mb-2">Bio (Max 200 chars)</label>
          <textarea
            maxLength={200}
            rows={4}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full border-2 border-unsw-charcoal p-3 font-body focus:outline-none focus:ring-2 focus:ring-unsw-yellow shadow-[2px_2px_0_0_#231F20] resize-none"
            placeholder="Tell us about yourself..."
          />
        </div>

        <div className="flex items-center gap-3 py-2">
          <input
            type="checkbox"
            id="isProfilePublic"
            checked={formData.isProfilePublic}
            onChange={(e) => setFormData({ ...formData, isProfilePublic: e.target.checked })}
            className="w-5 h-5 border-2 border-unsw-charcoal appearance-none checked:bg-unsw-yellow checked:after:content-['✓'] checked:after:flex checked:after:items-center checked:after:justify-center flex-shrink-0 cursor-pointer"
          />
          <label htmlFor="isProfilePublic" className="font-mono text-sm font-bold cursor-pointer">
            Make Profile Public
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-unsw-yellow border-2 border-unsw-charcoal py-3 px-6 font-display font-bold text-lg hover:-translate-y-1 transition-transform shadow-[4px_4px_0_0_#231F20] disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
