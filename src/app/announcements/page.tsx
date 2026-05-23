'use client'

import { useState } from 'react';
import useSWR from 'swr';
import Topnav from '@/components/Topnav';
import { ButtonSolid } from '@/components/Button';
import { useToast } from '@/components/Toast';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { appFetch } from '@/utils/appFetch';
import { formatDistanceToNow } from 'date-fns';
import Container from '@/components/Container';
import Loading from '@/components/Loading';

const TYPE_LABELS: Record<string, string> = {
    general: 'General',
    birth: 'Birth',
    marriage: 'Marriage',
    event: 'Event',
};

const TYPE_COLORS: Record<string, string> = {
    general: 'bg-field_color text-text_color border border-border_color',
    birth: 'bg-blue-100 text-blue-800',
    marriage: 'bg-pink-100 text-pink-800',
    event: 'bg-green-100 text-green-800',
};

interface Announcement {
    id: number;
    title: string;
    content: string;
    type: string;
    postedBy: string;
    createdAt: string;
}

export default function AnnouncementsPage() {
    const toast = useToast();
    const { mainMemberName } = useSelector((state: RootState) => state.terms);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [type, setType] = useState('general');
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);

    const { data, isLoading, mutate } = useSWR('/api/announcements');
    const announcements: Announcement[] = data?.announcements || [];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;
        setSubmitting(true);
        try {
            const res = await appFetch('/api/announcements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: title.trim(), content: content.trim(), type, postedBy: mainMemberName || 'Family Member' }),
            });
            if (!res.ok) throw new Error('Failed to post');
            setTitle('');
            setContent('');
            setType('general');
            setShowForm(false);
            mutate();
            toast?.show('Announcement posted', 'success');
        } catch {
            toast?.show('Failed to post announcement', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        setDeletingId(id);
        try {
            const res = await appFetch(`/api/announcements/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');
            mutate();
            toast?.show('Announcement deleted', 'success');
        } catch {
            toast?.show('Failed to delete', 'error');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="w-full">
            <Topnav />
            <Container className="px-3 xl:px-6 pb-6 max-w-2xl mx-auto">
                <div className="flex items-center justify-between pt-6 pb-4">
                    <h1 className="text-xl font-semibold text-text_color">Family Board</h1>
                    <button
                        onClick={() => setShowForm(v => !v)}
                        className="text-sm px-3 py-1.5 rounded-md border border-accent_color text-accent_color hover:bg-accent_color hover:text-accent_contrast transition-colors"
                    >
                        {showForm ? 'Cancel' : '+ Post'}
                    </button>
                </div>

                {showForm && (
                    <form onSubmit={handleSubmit} className="mb-6 p-4 border border-border_color rounded-lg bg-field_color space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-text_color mb-1">Title</label>
                            <input
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                maxLength={200}
                                required
                                placeholder="e.g. Welcome baby Arjun!"
                                className="w-full px-3 py-2 rounded-md border border-border_color bg-main_background text-text_color text-sm focus:outline-none focus:border-accent_color"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text_color mb-1">Message</label>
                            <textarea
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                maxLength={2000}
                                required
                                rows={4}
                                placeholder="Share the news with your family..."
                                className="w-full px-3 py-2 rounded-md border border-border_color bg-main_background text-text_color text-sm focus:outline-none focus:border-accent_color resize-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text_color mb-1">Type</label>
                            <select
                                value={type}
                                onChange={e => setType(e.target.value)}
                                className="px-3 py-2 rounded-md border border-border_color bg-main_background text-text_color text-sm focus:outline-none focus:border-accent_color"
                            >
                                <option value="general">General</option>
                                <option value="birth">Birth</option>
                                <option value="marriage">Marriage</option>
                                <option value="event">Event</option>
                            </select>
                        </div>
                        <div className="flex justify-end">
                            <ButtonSolid buttonText="Post" type="submit" isLoading={submitting} loadingText="Posting..." className="px-6" />
                        </div>
                    </form>
                )}

                {isLoading ? (
                    <Loading />
                ) : announcements.length === 0 ? (
                    <p className="text-center text-text_color/60 pt-12">No announcements yet. Be the first to post!</p>
                ) : (
                    <div className="space-y-4">
                        {announcements.map(a => (
                            <div key={a.id} className="p-4 border border-border_color rounded-lg bg-field_color">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TYPE_COLORS[a.type] || TYPE_COLORS.general}`}>
                                            {TYPE_LABELS[a.type] || a.type}
                                        </span>
                                        <h2 className="font-semibold text-text_color">{a.title}</h2>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(a.id)}
                                        disabled={deletingId === a.id}
                                        className="text-xs text-text_color/40 hover:text-red-500 transition-colors shrink-0 disabled:opacity-40"
                                        aria-label="Delete"
                                    >
                                        {deletingId === a.id ? '...' : '✕'}
                                    </button>
                                </div>
                                <p className="mt-2 text-sm text-text_color whitespace-pre-wrap">{a.content}</p>
                                <p className="mt-3 text-xs text-text_color/50">
                                    {a.postedBy} · {formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </Container>
        </div>
    );
}
