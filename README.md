# Renote

A command line notes app written using Node. The app lets you schedule notes to be 'reviewed' at a later date, much like flashcard software.

## Architecture
The app is broken up into `CliComponent`s. These are JavaScript `AsyncGenerator`s that provide instructions on how the UI should progress. For example, print a string, or ask the user a question. This allows the entire UI to be constructed using pure functions, with all side effects pushed to the edges. It also allows for extensive testing, without needing to mock the command prompt.
