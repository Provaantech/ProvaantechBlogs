import Editor from './components/Editor';
import Settings from './components/Settings';
import { SettingsProvider } from './contexts/SettingsContext';
import './index.css';
import './App.css';
import './styles/Editor.css';
import './styles/Settings.css';
import './styles/FloatingToolbars.css';
import './themes/EditorTheme.css';
import './styles/TreeView.css';
import './styles/Toast.css';
import './styles/ComponentPicker.css';
import './styles/EmojiPicker.css';
import './styles/TypeaheadMenu.css';
import './styles/ActionsPlugin.css';
import './styles/UI.css';

function App() {
  return (
    <SettingsProvider>
      <div className="app">
        <header className="app-header">
          <h1>My Lexical Playground</h1>
          <p>A complete rich text editor built with React</p>
        </header>
        
        <main className="app-main">
          <Editor />
        </main>
        
        <footer className="app-footer">
          <p>Built with ❤️ using Lexical Vite</p>
        </footer>
        
        <Settings />
      </div>
    </SettingsProvider>
  )
}

export default App
