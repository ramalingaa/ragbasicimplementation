import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from 'zustand/auth/authStore';
import { useQueriesState } from '../../zustand/queries/queriesStore';

const useUserProfileInfo = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [techStack, setTechStack] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [llmModel, setLlmModel] = useState<string>('');

  const { setLlmModel: setStoreLlmModel } = useQueriesState();

  const [isSavedSuccessfully, setIsSavedSuccessfully] =
    useState<boolean>(false);
  const { user } = useAuthStore();

  const userId = user?.sub;

  const initiateSaveUserProfileInfo = async () => {
    setIsLoading(true);
    setIsSavedSuccessfully(false);
    setError(null);

    // if (email === '' || phoneNumber === '' || name === '') {
    //   setIsLoading(false);
    //   setError('Name, email, and phone number must be provided.');
    //   return;
    // }

    try {
      const payload = {
        userId,
        phoneNumber,
        email,
        name,
        company,
        techStack,
      };
      await axios.post('/api/settings/saveUserProfileInfo', payload);
      setIsLoading(false);
      setIsSavedSuccessfully(true);
    } catch (e) {
      setIsLoading(false);
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An error occurred');
      }
    }
  };

  const initiateGetUserProfileInfo = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/settings/getUserProfileInfo', {
        userId,
      });

      const { phoneNumber, email, name, company, techStack, llmModel } =
        response.data.data;

      if (!llmModel) {
        setLlmModel('gpt-3.5-turbo');
      } else {
        setLlmModel(llmModel);
      }

      setPhoneNumber(phoneNumber);
      setEmail(email);
      setName(name);
      setCompany(company);
      setTechStack(techStack);
      setLlmModel(llmModel);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An error occurred');
      }
    }
  };

  useEffect(() => {
    if (!userId) {
      return;
    }
    initiateGetUserProfileInfo();
  }, [user]);

  return {
    phoneNumber,
    setPhoneNumber,
    email,
    setEmail,
    name,
    setName,
    company,
    setCompany,
    techStack,
    setTechStack,
    initiateSaveUserProfileInfo,
    initiateGetUserProfileInfo,
    isLoading,
    error,
    isSavedSuccessfully,
    llmModel,
  };
};

export default useUserProfileInfo;
