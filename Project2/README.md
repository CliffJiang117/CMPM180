# Last Dance

## Before You Start

**Last Dance is designed as a one-time experience.**

The project uses browser storage to remember whether the piece has already been completed. After reaching the end, returning to the page in the same browser will not restart the original experience. Instead, the page remembers what was left behind.

During the piece, hover over the music fragments to listen to them and drag the fragments you want to keep onto the piano. Every choice also removes another possibility. When the selection period ends, the remaining sequence becomes the music for the character's final dance.

---

# Artist Statement

The idea for *Last Dance* appeared somewhat randomly. I sometimes get strange ideas during weekend emo moments, and this was one of them. At the time, I had been thinking about several works from the class, last week's reading Bertram's *Travesty Generator*, Zach Whalen's “Any Means Necessary to Refuse Erasure by Algorithm,” and also they relate to Yasunao Tone's *Solo for Wounded CD*.

What stayed with me from these works was the idea that errors, algorithms, deletion, and even failure do not have to be treated as something outside of an artwork. They can become part of the experience itself. Tone's damaged CD turns malfunction into sound, while Bertram's work made me think about how computational rules, rearrangement, omission, and failure can become part of the form of a piece rather than simply tools used to produce it.

Somehow these ideas combined into a much simpler and slightly stupid question in my head: what if a piece of code could die?

My first idea was very literal. I wanted to make a program that could delete itself. I looked into whether that was possible, but it quickly seemed unsafe and also probably unnecessarily complicated for a class project. The basic idea of deletion stayed, though. I still wanted the program to lose something permanently as it was being experienced.

The project became much more concrete after I brought the idea into discussion and talked with the professor. That conversation introduced another direction: instead of focusing only on deleting code, I could think about cutting audio into fragments and combining those fragments through interaction. That was the point where the different parts of the project started to connect.

If audio could be cut into separate pieces, then the player could listen to those pieces and decide which ones to preserve. But if the project was still about deletion and loss, choosing one thing should also mean losing something else. From there came the rule that every time the player saves one audio fragment, another unchosen fragment is randomly deleted.

This became the core structure of *Last Dance*. The player is not simply arranging music. They are building a sequence while the space of possible sequences is constantly shrinking. The player controls what they choose, the algorithm controls part of what disappears, and time eventually ends the process entirely. There are six short audio clips. During the first part of the sixty-second lifetime, the player can hover over each clip to preview it. They can then drag a clip onto the piano to save it. Every time a clip is saved, the program randomly deletes one of the remaining unchosen clips. The player decides what to preserve, but the program decides what is lost.

This is where the algorithm becomes part of the authorship of the piece. I created the six fragments and the rules. The player chooses which fragments to keep and in which order. The random system removes possibilities. Time eventually ends the selection completely. The final sequence is therefore not completely mine, not completely the player's, and not completely random. It exists because all of these systems act together.

When the selection period ends, the character begins its "last dance." The character is a very simple stick figure inspired loosely by figure skating poses. The four dance drawings are displayed in a random order while the saved audio sequence plays. Near the end of the sixty seconds, the character stops dancing, returns to its idle pose, falls sideways, and finally disappears. A grave remains.

The browser also saves the sequence using local storage. This was important to the final version of the idea. If the player returns to the page after completing the piece, the original selection process does not happen again. The character is already gone. Only the grave and piano remain, and the piano can replay the sequence that the player previously created. The code itself has obviously not literally died, but one possible execution of the code has ended permanently. What remains is closer to a memory of that execution.

Technically, this project ended up being much larger than I expected. Even the drag system was adapted from code I had already written for an older project, but connecting dragging, sound preview, random deletion, timing, animation, state changes, and browser storage still took much longer than I expected. Once again, this became one of those projects that I would describe as barely finished, or maybe slightly unfinished.

I originally planned to make more developed character animation. My idea was to draw several poses myself and then use AI image generation to create transitions between them. After spending some time experimenting with that process, I realized I did not really know how to make it work consistently, and it was actually taking more time than simply drawing something myself. The final character therefore became a very rough stick figure. I also accidentally left the base layer visible when exporting some of the PNG files, which is why the image assets still have white backgrounds.

The audio also did not reach the level I originally imagined. My music theory knowledge is still extremely limited, and I am not particularly satisfied with the fragments I made. In retrospect, using existing audio samples might have produced something that sounded much better. But using my own rough sounds also became part of what the project is. The final sequence is made from limited material, limited time, random loss, and imperfect decisions.

So, even if *Last Dance* is another project that I only barely managed to finish, I think the central idea survived the process. The work started with a question about whether code could die. The answer I ended up with is not that the source code disappears. Instead, one version of its possibilities disappears. The choices happen once, most of the alternatives are destroyed, the performance ends, and when the player returns, only a small record of what happened is left.