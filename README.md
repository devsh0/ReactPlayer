# ReactPlayer

Simple audio player written in HTML, CSS, and React.

[![react-player.gif](https://i.postimg.cc/QM9Q5kvN/react-player.gif)](https://postimg.cc/xkQNVH0B)

Wanted to do a project after I started learning React a couple of weeks ago, and this is what I decided to build.
The initial plan was to just write a very simple player with play/pause/resume support but one thing led to
another, and I ended up implementing a visualizer, an equalizer and a playlist.

# Running the App

1. Clone the project.
```
git clone https://github.com/devsh0/ReactPlayer.git
```
2. `cd` to the directory where you cloned the project.
3. `npm install` to install the dependencies.
4. `npm start` to start the app.

# Possible Improvements

As a result of adding unplanned features on top of other unplanned features, the codebase evolved into something
that is not so modular and can be improved in so many ways. Here are some of the issues that you would notice
immediately:

- One giant `index.css` that styles everything.
- Alignment of various components is inconsistent in some places.
- The player stutters very noticeably on Android (Chrome, not Firefox). This may have to do with the fact
that audio passes through a 10-node filter chain to finally reach the analyzer and the output node, but I'm not sure.
- Playlist view provides no visual feedback when tracks are loaded into memory, which can take a while.
- To spin up a quick-n-dirty project, I relied on my IDE (Webstorm) to provide the necessary env when starting
the project. The embedded Node.js, apparently, wasn't the latest LTS and I ended up pulling some deprecated packages
with it.
- No volume controller. Adding the controller isn't hard by any means; we can just link gain node at the tail end of the
audio graph. But adding the visual element for one more controller means disturbing the symmetry of existing controllers
on either side of the container. That's a funny reason to not have an important feature, I know.
- Zero tests. Plus error checks are missing almost everywhere (hey, you can always hit refresh!). 
- The overall usability on touch devices is below "awesome". Tuning the EQ bands requires clicking at the right
location because the vertical sliders are done manually and I was too lazy to implement a touch slider. Libraries
might have made things easier, but the plan was to use only React.
- Some things in the UI just don't make sense. Two control buttons that are responsible for switching the current
view are far apart. One click on the view controller buttons activates the corresponding view, two clicks deactivates
it and switches to the default view (Visualizer).
- Three binary audio files are part of the repository because I was under the impression that that's the only
way to sneak these files into Netlify at the time of deployment.

Please consider opening a PR if you would you like to improve something about this app.