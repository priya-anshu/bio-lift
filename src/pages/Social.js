import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image as ImageIcon,
  Video as VideoIcon,
  Smile,
  Send,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Hash,
  AtSign,
  Bell,
  Flame,
  ThumbsUp,
  Shield,
  Flag,
  Users,
  Trophy
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';

// Theme helpers
const accentClasses = 'from-day-accent-primary to-day-accent-secondary dark:from-night-accent dark:to-red-600';

// Post Composer
const PostComposer = ({ onCreate }) => {
  const [text, setText] = useState('');
  const [media, setMedia] = useState(null);
  const [type, setType] = useState('text');

  const handleCreate = () => {
    if (!text.trim() && !media) return;
    onCreate({
      id: crypto.randomUUID(),
      author: 'You',
      role: 'Member',
      avatar: '',
      createdAt: new Date().toISOString(),
      text,
      media,
      type,
      likes: 0,
      comments: [],
      reactions: {},
      pinned: false
    });
    setText('');
    setMedia(null);
    setType('text');
  };

  return (
    <Card className="p-4">
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br ${accentClasses} text-white flex items-center justify-center font-bold">Y</div>
        <div className="flex-1 space-y-3">
          <Input
            placeholder="Share an update with your gym... @mention, #tags"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-day-text-secondary dark:text-night-text-secondary">
              <button className="px-3 py-2 hover:bg-day-hover dark:hover:bg-night-hover rounded-lg" onClick={() => setType('image')}>
                <ImageIcon className="w-5 h-5" />
              </button>
              <button className="px-3 py-2 hover:bg-day-hover dark:hover:bg-night-hover rounded-lg" onClick={() => setType('video')}>
                <VideoIcon className="w-5 h-5" />
              </button>
              <button className="px-3 py-2 hover:bg-day-hover dark:hover:bg-night-hover rounded-lg">
                <Smile className="w-5 h-5" />
              </button>
            </div>
            <Button variant="primary" size="sm" onClick={handleCreate} icon={<Send className="w-4 h-4" />} iconPosition="right">
              Post
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Comment List
const CommentList = ({ comments, onAdd }) => {
  const [text, setText] = useState('');
  return (
    <div className="mt-3 space-y-3">
      {comments.map((c) => (
        <div key={c.id} className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-full bg-day-border dark:bg-night-border" />
          <div>
            <div className="text-sm font-semibold text-day-text-primary dark:text-night-text-primary">{c.author}</div>
            <div className="text-sm text-day-text-secondary dark:text-night-text-secondary">{c.text}</div>
          </div>
        </div>
      ))}
      <div className="flex items-center space-x-2">
        <Input size="sm" placeholder="Write a comment..." value={text} onChange={(e) => setText(e.target.value)} />
        <Button size="sm" variant="ghost" onClick={() => { if (!text.trim()) return; onAdd(text); setText(''); }}>Reply</Button>
      </div>
    </div>
  );
};

// Post Card
const PostCard = ({ post, onLike, onComment, onShare, onReact }) => {
  const [showMore, setShowMore] = useState(false);
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br ${accentClasses} text-white flex items-center justify-center font-bold">
            {post.author?.[0] || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-day-text-primary dark:text-night-text-primary">{post.author}</span>
              <Badge variant="ghost" size="sm">{post.role}</Badge>
            </div>
            <div className="text-xs text-day-text-secondary dark:text-night-text-secondary">{new Date(post.createdAt).toLocaleString()}</div>
          </div>
        </div>
        <button className="p-1 text-day-text-secondary dark:text-night-text-secondary hover:text-day-text-primary dark:hover:text-night-text-primary">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {post.text && (
        <p className="mt-3 text-day-text-primary dark:text-night-text-primary">
          {post.text}
        </p>
      )}

      {post.media && (
        <div className="mt-3">
          <div className="aspect-video rounded-lg overflow-hidden bg-black/10 dark:bg-white/5" />
        </div>
      )}

      <div className="mt-4 flex items-center justify-between text-day-text-secondary dark:text-night-text-secondary">
        <div className="flex items-center gap-4">
          <button onClick={onLike} className="flex items-center gap-1 hover:text-day-text-primary dark:hover:text-night-text-primary">
            <Heart className="w-4 h-4" /> {post.likes}
          </button>
          <button className="flex items-center gap-1 hover:text-day-text-primary dark:hover:text-night-text-primary">
            <MessageCircle className="w-4 h-4" /> {post.comments.length}
          </button>
          <button onClick={onShare} className="flex items-center gap-1 hover:text-day-text-primary dark:hover:text-night-text-primary">
            <Share2 className="w-4 h-4" /> Share
          </button>
        </div>
        <div className="flex items-center gap-2">
          {['👍','🔥','👏','💪'].map((emoji) => (
            <button key={emoji} className="px-2 py-1 hover:bg-day-hover dark:hover:bg-night-hover rounded" onClick={() => onReact(emoji)}>{emoji}</button>
          ))}
        </div>
      </div>

      <CommentList
        comments={post.comments}
        onAdd={(text) => onComment(text)}
      />

      <div className="mt-3 flex items-center gap-2 text-xs text-day-text-secondary dark:text-night-text-secondary">
        <Hash className="w-3 h-3" />
        <span>#training</span>
        <AtSign className="w-3 h-3 ml-3" />
        <span>@trainer</span>
      </div>
    </Card>
  );
};

// Right sidebar widgets
const SpotlightCard = () => (
  <Card className="p-4">
    <div className="flex items-center gap-2 mb-2">
      <Trophy className="w-5 h-5 text-yellow-500" />
      <h3 className="font-semibold text-day-text-primary dark:text-night-text-primary">Weekly Member Spotlight</h3>
    </div>
    <p className="text-sm text-day-text-secondary dark:text-night-text-secondary">Congrats to Alex for a 7-day streak! 💪</p>
  </Card>
);

const TrendingCard = () => (
  <Card className="p-4">
    <div className="flex items-center gap-2 mb-2">
      <Flame className="w-5 h-5 text-red-500" />
      <h3 className="font-semibold text-day-text-primary dark:text-night-text-primary">Trending Posts</h3>
    </div>
    <ul className="text-sm text-day-text-secondary dark:text-night-text-secondary space-y-1">
      <li>#mobility tips</li>
      <li>#protein talk</li>
      <li>#new class schedule</li>
    </ul>
  </Card>
);

const PollCard = () => {
  const [choice, setChoice] = useState('');
  const [voted, setVoted] = useState(false);
  const options = ['New yoga slot', 'Weekend bootcamp', 'Nutrition webinar'];
  return (
    <Card className="p-4">
      <h3 className="font-semibold text-day-text-primary dark:text-night-text-primary mb-2">Weekly Poll</h3>
      <div className="space-y-2">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2">
            <input type="radio" name="poll" checked={choice === opt} onChange={() => setChoice(opt)} />
            <span className="text-sm text-day-text-primary dark:text-night-text-primary">{opt}</span>
          </label>
        ))}
      </div>
      <Button size="sm" className="mt-3" variant="primary" onClick={() => setVoted(true)}>Vote</Button>
      {voted && (
        <div className="mt-3 text-xs text-day-text-secondary dark:text-night-text-secondary">Thanks for voting! Results soon.</div>
      )}
    </Card>
  );
};

const NotificationsPanel = () => (
  <Card className="p-4">
    <div className="flex items-center gap-2 mb-2">
      <Bell className="w-5 h-5 text-day-accent-primary dark:text-night-accent" />
      <h3 className="font-semibold text-day-text-primary dark:text-night-text-primary">Notifications</h3>
    </div>
    <ul className="space-y-2 text-sm text-day-text-secondary dark:text-night-text-secondary">
      <li><ThumbsUp className="inline w-4 h-4 mr-1" /> Mike liked your post</li>
      <li><MessageCircle className="inline w-4 h-4 mr-1" /> Sarah commented on your video</li>
      <li><Users className="inline w-4 h-4 mr-1" /> Trainer mentioned you</li>
    </ul>
  </Card>
);

const ModerationTools = () => (
  <Card className="p-4">
    <div className="flex items-center gap-2 mb-2">
      <Shield className="w-5 h-5" />
      <h3 className="font-semibold text-day-text-primary dark:text-night-text-primary">Moderation</h3>
    </div>
    <div className="grid grid-cols-2 gap-2">
      <Button variant="ghost" size="sm"><Flag className="w-4 h-4 mr-1" /> Reports</Button>
      <Button variant="ghost" size="sm"><Users className="w-4 h-4 mr-1" /> Manage Members</Button>
    </div>
  </Card>
);

const Social = () => {
  const [posts, setPosts] = useState(() => ([
    {
      id: 'p1',
      author: 'Trainer Emma',
      role: 'Trainer',
      avatar: '',
      createdAt: new Date().toISOString(),
      text: 'Form tip: keep your core tight during squats! @members #mobility',
      media: null,
      type: 'text',
      likes: 24,
      comments: [ { id: 'c1', author: 'Alex', text: 'Super helpful, thanks!' } ],
      reactions: { '👍': 3, '🔥': 2 }
    }
  ]));

  const handleCreate = (newPost) => {
    setPosts((p) => [newPost, ...p]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold text-day-text-primary dark:text-night-text-primary">Community Feed</h1>
        <p className="text-day-text-secondary dark:text-night-text-secondary">Private space for members, trainers, and owner</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-4">
          <PostComposer onCreate={handleCreate} />
          <AnimatePresence>
            {posts.map((post) => (
              <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <PostCard
                  post={post}
                  onLike={() => setPosts((ps) => ps.map(p => p.id === post.id ? { ...p, likes: p.likes + 1 } : p))}
                  onComment={(text) => setPosts((ps) => ps.map(p => p.id === post.id ? { ...p, comments: [...p.comments, { id: crypto.randomUUID(), author: 'You', text }] } : p))}
                  onShare={() => alert('Shared!')}
                  onReact={(emoji) => setPosts((ps) => ps.map(p => p.id === post.id ? { ...p, reactions: { ...p.reactions, [emoji]: (p.reactions[emoji] || 0) + 1 } } : p))}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <NotificationsPanel />
          <TrendingCard />
          <PollCard />
          <SpotlightCard />
          <ModerationTools />
        </div>
      </div>
    </div>
  );
};

export default Social;


