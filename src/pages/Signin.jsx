import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Quess from '../assets/quesslogo.png'

const Signin = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false); 

    return (
        <div>
            {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white"></div>
        </div>
      )}
            <section className="bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <img className="w-22 h-16 mr-2 mb-5" src={Quess} alt="logo" />
                    <div className="w-full bg-[#a2bcc9] rounded-lg shadow-md sm:max-w-md xl:p-0 p-6">
                        <div className="p-6 space-y-4">

                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
                                Sign in to your account
                            </h1>
                            <form className="space-y-4">
                                <div>
                                    <label htmlFor="email"className="block mb-2 text-sm font-medium text-gray-900">Your email</label>
                                    <input type="email" name="email" id="email"
                                        className="bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-[#0094d9] focus:border-[#0094d9] block w-full p-2.5"
                                        placeholder="name@company.com" required />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                                    <input type="password" name="password" id="password" placeholder="••••••••"
                                        className="bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-[#0094d9] focus:border-[#0094d9] block w-full p-2.5"
                                        required />
                                </div>
                                <button type="submit"
                                    className="w-full flex justify-center text-white bg-[#0094d9] hover:bg-[#007bb5] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5">
                                    Sign in
                                </button>



                                <p className="text-sm font-light text-gray-600 text-center">
                                    Don’t have an account yet?
                                    <span
                                        className="font-medium text-blue-700 hover:underline cursor-pointer"
                                        onClick={() => navigate('/signup')}
                                    > Sign up</span>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Signin;
