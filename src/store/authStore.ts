import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/services/supabase';
import { Profile } from '@/types/models';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  initialized: boolean;
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: false,
  initialized: false,

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        const defaultProfile: Profile = {
          id: session.user.id,
          email: session.user.email!,
          display_name: session.user.email!.split('@')[0],
          niche: '',
          platforms: [],
          tone_of_voice: '',
          goals: [],
          onboarded: false,
          created_at: new Date().toISOString(),
        };

        set({
          user: session.user,
          profile: error ? defaultProfile : (profile as Profile),
          initialized: true,
        });
      } else {
        set({ initialized: true });
      }
    } catch (error) {
      console.error('Initialize error:', error);
      set({ initialized: true });
    }
  },

  signIn: async (email: string, password: string) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) console.warn('Profile fetch failed:', profileError.message);

      set({
        user: data.user,
        profile: (profile as Profile) || {
          id: data.user.id,
          email: data.user.email!,
          display_name: data.user.email!.split('@')[0],
          niche: '',
          platforms: [],
          tone_of_voice: '',
          goals: [],
          onboarded: false,
          created_at: new Date().toISOString(),
        },
        loading: false,
      });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  signUp: async (email: string, password: string, displayName: string) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;

      if (data.user) {
        const { error: insertError } = await supabase.from('profiles').insert({
          id: data.user.id,
          email: data.user.email!,
          display_name: displayName,
          onboarded: false,
        });
        if (insertError) console.warn('Profile insert failed (table may not exist):', insertError.message);

        set({
          user: data.user,
          profile: {
            id: data.user.id,
            email: data.user.email!,
            display_name: displayName,
            niche: '',
            platforms: [],
            tone_of_voice: '',
            goals: [],
            onboarded: false,
            created_at: new Date().toISOString(),
          },
          loading: false,
        });
      }
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null });
  },

  refreshProfile: async () => {
    const { user } = get();
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (data) {
      set({ profile: data as Profile });
    }
  },

  updateProfile: (updates) => {
    const { profile } = get();
    if (profile) {
      set({ profile: { ...profile, ...updates } });
    }
  },
}));
