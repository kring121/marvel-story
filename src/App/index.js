import React, { Component } from 'react';
import axios from 'axios';
import './style.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

const publicKey = process.env.REACT_APP_PUBLIC_KEY;

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      storyObject: {},
      storyInfo: {},
      comicImage: '',
      comicUrl: '',
      characterInfo: {},
      characterImage: '',
      characterUrl: ''
    }
  }

  componentDidMount(){
    // Initialize animate on scroll
    AOS.init({
      duration: 2000
    })
    // Fetch Story data and set it to state
    axios.get(`https://gateway.marvel.com:443/v1/public/comics/69933?apikey=${publicKey}`)
    .then(res => res.data)
    .then(story => this.setState(
      {
        storyObject: story,
        storyInfo: story.data.results[0],
        comicImage: story.data.results[0].thumbnail.path.replace(/^http:\/\//i, 'https://'),
        comicUrl: story.data.results[0].urls[0].url.replace(/^http:\/\//i, 'https://')
      }
    ))
    .then(res => this.fetchCharacterData())
    .catch(err => console.log(err.response))
  }

  fetchCharacterData(){
    // Fetch Character data and set it to state
    const { storyInfo } = this.state;
    const characterLink = storyInfo.characters.items[0].resourceURI;
    axios.get(`${characterLink}?apikey=${publicKey}`)
    .then(res => res.data.data)
    .then(characterData => this.setState(
      {
        characterInfo: characterData.results[0],
        characterImage: characterData.results[0].thumbnail.path.replace(/^http:\/\//i, 'https://'),
        characterUrl: characterData.results[0].urls[0].url.replace(/^http:\/\//i, 'https://')
      }
    ))
    .catch(err => console.log(err.response))
  }

  render() {
    const { storyObject, storyInfo, comicImage, characterInfo, comicUrl, characterImage, characterUrl } = this.state;
    return (
      <div className="app">
        <section className='title-section'>
          <h1 className='title'>{storyInfo.title}</h1>
        </section>
        <section id='comic-details'>
          <div id='comic-img-container' data-aos='slide-right'>
            <img id='comic-img' alt={storyInfo.title} src={comicImage +'/landscape_incredible.jpg'}/>
          </div>
          <div id='story-desc-container' data-aos='fade-in'>
            <h1>Summary</h1>
            <p id='story-desc'>{storyInfo.description}</p>
            <a href={comicUrl}>
              <button>Read More</button>
            </a>
          </div>
        </section>
        <section id='title-section-2' className='title-section'>
          <h1 className='title'>Characters</h1>
        </section>
        <section id='character-details'>
          <div id='character-desc-container' data-aos='fade-in' data-aos-delay='200'>
            <h1>{characterInfo.name}</h1>
            <p id='character-desc'>{characterInfo.description}</p>
            <a href={characterUrl}>
              <button>Read More</button>
            </a>
          </div>
          <div id='character-img-container' data-aos='slide-left' data-aos-duration='2500'>
            <img id='character-img' src={characterImage+'/landscape_incredible.jpg'} alt={characterInfo.name}/>
            <img id='thors-hammer' src='https://s3.amazonaws.com/project-4-bucket/thorshammer-edited.png' alt='Thors hammer'/>
          </div>
        </section>
        <footer>
          <a href='https://marvel.com'>{storyObject.attributionText}</a>
          <a href='http://christianvonlehe.com'>This site was made with &hearts; by Christian von Lehe</a>
          <p>More heroes coming soon</p>
        </footer>
      </div>
    );
  }
}

export default App;
