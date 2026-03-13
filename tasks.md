Build a full-stack SaaS streaming platform called "EchoLive".

EchoLive is a cloud streaming studio designed especially for churches to broadcast services online using either AUDIO ONLY or FULL VIDEO PRODUCTION.

The platform combines features similar to vMix, OBS Studio, and Restream, but runs completely in the browser.

Main Goals:
- Churches without cameras should still be able to stream using audio only.
- Churches with cameras can use a full live production studio similar to vMix.
- Streams generate a public link that anyone can open without creating an account.

Stack Requirements

Frontend:
Next.js 16 (App Router)
TypeScript
Tailwind CSS
ShadCN UI
Web Audio API
WebRTC

Backend:
Convex (database + realtime)
Clerk (authentication)

Streaming Infrastructure:
LiveKit (WebRTC streaming)
RTMP output for multistream
HLS playback for viewers

Hosting:
Frontend: Vercel
Media server: LiveKit
Database: Convex

Authentication

Use Clerk authentication.

Providers:
- Google OAuth

Authentication is REQUIRED only for the main application.

Protected routes:
- /dashboard
- /studio/[streamId]
- /analytics
- /settings

Public routes must not require login.

Anyone should be able to watch streams without signing up.

Public Stream Links

Audio stream page:
/a/[streamId]

Video stream page:
/v/[streamId]

Visitors can open these links and immediately listen or watch.

No login required.

Product Features

1. Dashboard

After login users see a dashboard where they can:

- create a new stream
- choose stream type (audio or video)
- view past recordings
- view analytics
- manage stream destinations

Dashboard layout:

Left sidebar navigation:

Dashboard
Streams
Studio
Analytics
Settings

Main dashboard cards:

Upcoming streams
Active streams
Viewer analytics
Recent recordings

2. Audio Streaming Studio

If the user selects AUDIO stream they open an audio studio.

This page allows the church to broadcast using only a microphone.

Layout:

Top:
Stream status indicator
Live button

Center:
Large animated waveform visualizer

Left panel:
Microphone selection

Right panel:
Audio processing controls

Audio Processing Features:

- Noise suppression
- Noise gate
- Compressor
- Limiter
- 10-band equalizer
- Gain control
- Audio level meters

Use Web Audio API to process audio.

Streaming flow:

Microphone
↓
Web Audio API processing
↓
WebRTC (LiveKit)
↓
Media server
↓
HLS output
↓
Public player

When user clicks "Go Live", the system generates a public audio link:

example:

echolive.com/a/abc123

3. Video Streaming Studio

This is the main feature.

Build a browser-based production studio similar to vMix.

Studio Layout

Top section:

Preview Monitor
Program Monitor

Preview monitor shows next scene.
Program monitor shows live broadcast.

Left panel:

Sources list.

Supported sources:

Camera
Screen share
Video file
Image
Audio file
Overlay graphics
Lower thirds
Countdown timer
Bible verse text

Users can add and remove sources.

Bottom panel:

Scene switcher.

Scenes are collections of sources.

Example scenes:

Intro
Worship
Sermon
Offering
Ending

Clicking a scene instantly switches the live output.

Right panel:

Audio mixer.

Audio Mixer Features:

Each source has:

Volume slider
VU meter
Mute button
Solo button

Advanced controls:

Compressor
Limiter
EQ
Noise gate

Bottom controls:

Go Live
Stop Stream
Record
Stream destinations

4. Multistream

Allow the user to connect external platforms.

Supported destinations:

YouTube Live
Facebook Live
Twitch
Custom RTMP

User pastes RTMP key.

The system sends the stream to those destinations.

5. Public Player Pages

Two types of players.

Audio Player Page

Route:
/a/[streamId]

UI layout:

Church logo
Stream title
Live badge
Large play button
Animated waveform
Listener count
Share buttons

Should behave like an MP3 streaming player.

Auto reconnect if connection drops.

Video Player Page

Route:
/v/[streamId]

UI layout:

Large video player
Live badge
Viewer count
Optional chat panel
Share buttons

Playback uses HLS.

Works on mobile and desktop.

6. Recording

Every stream should automatically record.

Recording features:

Save video or audio
Store recording
Allow download
Allow replay later

Recording page:

List of past streams with play button.

7. Analytics

Track analytics for each stream.

Metrics:

Total viewers
Peak viewers
Total listeners
Average watch duration
Countries of viewers

Display analytics using charts.

Analytics page shows:

Line chart of viewers over time
Country map
Session duration

8. Database Schema (Convex)

Users table

id
clerkId
churchName
logo
createdAt

Streams table

id
publicId
title
type (audio or video)
status (scheduled, live, ended)
ownerId
rtmpKey
createdAt

Scenes table

id
streamId
name
sources

Sources table

id
streamId
type
config
position
size
zIndex

Analytics table

id
streamId
viewerCount
listenerCount
country
watchDuration

9. Next.js Route Structure

/app

/(marketing)
/page.tsx
/pricing

/(public)
/a/[id]/page.tsx
/v/[id]/page.tsx

/(app)
/dashboard/page.tsx
/studio/[streamId]/page.tsx
/analytics/page.tsx
/settings/page.tsx

Protect /(app) routes with Clerk middleware.

10. UI Design

Design style:

Modern SaaS dashboard.

Colors:

Primary: #6A5ACD
Accent: #F5B841

Font:

Inter

Themes:

Light mode for dashboard
Dark mode for streaming studio

Studio UI inspiration:

vMix
OBS Studio
Streamyard

11. Audio Quality Enhancements

Add intelligent audio features:

Auto gain leveling
Automatic noise removal
Speech clarity enhancement

Optimize audio for sermons and speech.

12. Performance Requirements

Low latency streaming.

Use WebRTC for ingestion.

Convert to HLS for public playback.

Optimize for:

Mobile devices
Low bandwidth viewers
Slow internet connections

13. Deployment Architecture

Frontend: Vercel
Database: Convex
Auth: Clerk
Media server: LiveKit
Storage: cloud object storage

Make the platform scalable for thousands of concurrent viewers.

End goal:

A polished SaaS streaming platform where churches can go live instantly and share a link for viewers to watch or listen without creating an account.