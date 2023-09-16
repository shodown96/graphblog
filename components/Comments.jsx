import React, { useEffect, useState } from 'react';
import moment from 'moment';
import parse from 'html-react-parser';

import { getComments, submitComment } from '../services';
import toast from 'react-hot-toast';
import Button from './Button';

const Comments = ({ slug }) => {
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [localStorage, setLocalStorage] = useState(null);
  const [formData, setFormData] = useState({ name: null, email: null, body: null, storeData: false });

  useEffect(() => {
    getComments(slug).then((result) => {
      setComments(result);
    });
  }, []);


  useEffect(() => {
    setLocalStorage(window.localStorage);
    const initalFormData = {
      name: window.localStorage.getItem('name'),
      email: window.localStorage.getItem('email'),
      storeData: window.localStorage.getItem('name') || window.localStorage.getItem('email'),
    };
    setFormData(initalFormData);
  }, []);

  const onInputChange = (e) => {
    const { target } = e;
    if (target.type === 'checkbox') {
      setFormData((prevState) => ({
        ...prevState,
        [target.name]: target.checked,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [target.name]: target.value,
      }));
    }
  };

  const handlePostSubmission = () => {
    setError(false);
    setIsLoading(true)
    const { name, email, body, storeData } = formData;
    if (!name || !email || !body) {
      setError(true);
      return;
    }
    const commentObj = {
      name,
      email,
      body,
      slug,
    };

    if (storeData) {
      localStorage.setItem('name', name);
      localStorage.setItem('email', email);
    } else {
      localStorage.removeItem('name');
      localStorage.removeItem('email');
    }

    submitComment(commentObj)
      .then((res) => {
        console.log(res)
        if (res.id) {
          if (!storeData) {
            formData.name = '';
            formData.email = '';
          }
          formData.comment = '';
          setFormData((prevState) => ({
            ...prevState,
            ...formData,
          }));
          toast.success('Sucessfully submitted comment!')
          getComments(slug).then((result) => {
            setComments(result);
          });
        } else {
          toast.error('Oops, something happened!')
        }
        setIsLoading(false)
      })
      .catch(() => {
        toast.error('Oops, something happened!')
        setIsLoading(false)
      });
  };

  return (
    <div>
      <div>
        <div className="bg-white shadow-lg rounded-lg p-8 pb-12 mb-8">
          <h3 className="text-xl mb-8 font-semibold border-b pb-4">Leave a Reply</h3>
          <div className="grid grid-cols-1 gap-4 mb-4">
            <textarea value={formData.body} onChange={onInputChange} className="p-4 outline-none w-full rounded-lg h-40 focus:ring-2 focus:ring-gray-200 bg-gray-100 text-gray-700" name="body" placeholder="Comment" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <input type="text" value={formData.name} onChange={onInputChange} className="py-2 px-4 outline-none w-full rounded-lg focus:ring-2 focus:ring-gray-200 bg-gray-100 text-gray-700" placeholder="Name" name="name" />
            <input type="email" value={formData.email} onChange={onInputChange} className="py-2 px-4 outline-none w-full rounded-lg focus:ring-2 focus:ring-gray-200 bg-gray-100 text-gray-700" placeholder="Email" name="email" />
          </div>
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div>
              <input checked={formData.storeData} onChange={onInputChange} type="checkbox" id="storeData" name="storeData" value="true" />
              <label className="text-gray-500 cursor-pointer" htmlFor="storeData"> Save my name, email in this browser for the next time I comment.</label>
            </div>
          </div>
          {error && <p className="text-xs text-red-500">All fields are mandatory</p>}
          <div className="mt-8">
            <Button loading={isLoading} onClick={handlePostSubmission}>Post Comment</Button>
          </div>
        </div>
      </div>
      <div>
        {comments.length > 0 && (
          <div className="bg-white shadow-lg rounded-lg p-8 pb-12 mb-8">
            <h3 className="text-xl mb-8 font-semibold border-b pb-4">
              {comments.length}
              {' '}
              Comments
            </h3>
            {comments.map((comment, index) => (
              <div key={index} className="border-b border-gray-100 mb-4 pb-4">
                <p className="mb-4">
                  <span className="font-semibold">{comment.name}</span>
                  {' '}
                  on
                  {' '}
                  {moment(comment.createdAt).format('MMM DD, YYYY')}
                </p>
                <p className="whitespace-pre-line text-gray-600 w-full">{parse(comment.body)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments;
