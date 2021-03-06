import React from 'react';
import {getBook, getBookOrigin, getChapterList} from "./requests";

const store = {
  chapterList: [],
  bookInfo: {},
  order: true
};

export default function (Component) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        chapterList: [],
        bookInfo: {},
        order: true,
        loading: false
      };
    }

    componentWillMount() {
      const bookId = this.props.match.params.id;
      const {bookInfo} = store;

      if (bookInfo._id === bookId && store.chapterList.length) {
        this.setState({
          ...store
        });
      } else {
        this.setState({
          loading: true
        });
        this.getBook(bookId);
        this.getBookOrigin(bookId);
      }
    }

    getBook(id) {
      getBook(id)
        .then(
          data => {
            store.bookInfo = data;
            this.setState({
              bookInfo: data
            });
          }
        )
    }

    getBookOrigin(id) {
      getBookOrigin(id)
        .then(
          data => {
            let index = data.findIndex(item => item.source === 'my176');
            if (index < 0) {
              if (data.length > 1) {
                index = 1
              } else {
                index = 0
              }
            }
            this.getChapterList(data[index]._id)
          }
        )
    }

    getChapterList(id) {
      getChapterList(id)
        .then(
          data => {
            const {chapters: chapterList} = data;
            store.chapterList = chapterList;
            this.setState({
              chapterList,
              loading: false
            })
          }
        )
    }

    reverseChapterList() {
      const {
        chapterList,
        order
      } = this.state;

      const _ = {
        order: !order,
        chapterList: chapterList.reverse()
      };

      this.setState(_);
      Object.assign(store, _)
    }

    render() {
      const {
        reverseChapterList
      } = this;

      return (
        <Component {...this.props}
                   {...this.state}
                   reverseChapterList={reverseChapterList.bind(this)}/>
      )
    }
  }
}
