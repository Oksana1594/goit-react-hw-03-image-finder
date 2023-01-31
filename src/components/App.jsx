import { Component } from 'react';
import { Circles } from 'react-loader-spinner';

import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Modal from './Modal/Modal';
import ImageDeteils from './ImageDeteils/ImageDeteils';

// import { Audio } from 'react-loader-spinner';

import { fetchImagesApi } from '../Services/api';

export class App extends Component {
  state = {
    search: '',
    isImagesListShow: false,
    images: [],
    isLoading: false,
    page: 1,
    currentImage: null,
    showModal: false,
  };

  componentDidUpdate(_, prevState) {
    const { search, page } = this.state;
    if (prevState.search !== search || prevState.page !== page) {
      this.fetchImages();
    }
  }
  async fetchImages() {
    try {
      this.setState({ isLoading: true });
      const { search, page } = this.state;
      const data = await fetchImagesApi(search, page);
      this.setState(prevState => {
        return {
          images: [...prevState.images, ...data.hits],
        };
      });
    } catch (error) {
      this.setState({ error: error.message });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  searchImages = ({ search }) => {
    this.setState({ search, images: [], page: 1 });
  };

  loadMore = () => {
    this.setState(({ page }) => ({ page: page + 1 }));
  };

  showImage = ({ tags, largeImageURL }) => {
    this.setState({
      currentImage: {
        tags,
        largeImageURL,
      },
      showModal: true,
    });
  };

  closeModal = () => {
    this.setState({
      showModal: false,
      currentImage: null,
    });
  };

  render() {
    const { images, isLoading, currentImage, showModal, error } = this.state;
    const { searchImages, loadMore, showImage, closeModal } = this;
    return (
      <>
        <Searchbar onSubmit={searchImages} />

        {Boolean(images.length) && (
          <ImageGallery images={images} showImage={showImage} />
        )}
        {error && <p>{error}</p>}

        {Boolean(images.length) && (
          <Button text="Load more" clickHandler={loadMore} />
        )}
        {isLoading && (
          <Circles
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="circles-loading"
            wrapperStyle={{
            }}
            wrapperClass=""
            visible={true}
          />
        )}
        {showModal && (
          <Modal close={closeModal}>
            <ImageDeteils {...currentImage} />
          </Modal>
        )}
      </>
    );
  }
}
