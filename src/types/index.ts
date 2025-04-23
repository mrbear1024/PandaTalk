export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  stats?: {
    podcasts: number;
    episodes: number;
    listeningTime: string;
  };
}

export interface Episode {
  id: string;
  title: string;
  description: string;
  duration: string;
  publishDate: string;
  audioUrl: string;
  coverImage: string;
  podcastId: string;
  podcastName: string;
  podcastAuthor: string;
  podcastCoverImage: string;
}

export interface Podcast {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  category: string;
  episodes: Episode[];
  rating: number;
  reviews: number;
  subscribers: number;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  episodes: Episode[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  podcastCount: number;
}

export interface SearchResult {
  podcasts: Podcast[];
  episodes: Episode[];
  playlists: Playlist[];
}

export interface UserStats {
  podcasts: number;
  episodes: number;
  listeningTime: string;
  favoriteCategories: string[];
  recentEpisodes: Episode[];
  recommendedPodcasts: Podcast[];
}

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
    info: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    h1: {
      fontSize: number;
      fontWeight: string;
    };
    h2: {
      fontSize: number;
      fontWeight: string;
    };
    h3: {
      fontSize: number;
      fontWeight: string;
    };
    body: {
      fontSize: number;
      fontWeight: string;
    };
    caption: {
      fontSize: number;
      fontWeight: string;
    };
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
} 