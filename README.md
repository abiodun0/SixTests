# SixTests
Testing platform built with VueJS and Firebase.

### Installation
Clone the repo. Install npm and bower dependencies.
```
npm install
bower install
```

Bundle the application.
```
webpack
```

You may run `webpack -w` if you want to watch for changes while developing.

Start the application

```
npm start
```

The app will usually launch a new browser window and run on port 8080.

### App Architecture

The application has the following directories
- `app/components` - Vue components are stored here. One folder per component containing `.js` file and `.html` templates associated with that components.
- `app/models` - Firebase data models are stored here. Each model is a singleton with CRUD methods.
- `app/scss` - SASS stylesheet (Not yet implemented)
- `assets/psd` - PSD assets
- `build/` - Compiled source files
- `build/lib` - Bower dependencies
