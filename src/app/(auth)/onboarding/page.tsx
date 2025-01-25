"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Chats } from "@phosphor-icons/react";
import { Navbar } from "@/components/Navbar";
import { Separator } from "@/components/ui/separator";

const initialSuggestions = ["Gym", "Startups", "Technology", "Art", "Music", "Travel", "Cooking", "Reading", "Gaming", "Sports"];

const steps = [
  { title: "Basic Information", fields: ["name", "birthYear"] },
  { title: "Education & Career", fields: ["occupation"] },
  { title: "Interests", fields: ["interests"] },
  { title: "Life Goals", fields: ["lifeGoals"] },
  { title: "Financial Literacy", fields: ["financialLiteracy"] },
  { title: "Baby Information", fields: ["hasBaby", "waitingForBaby", "babyInfo"] },
  { title: "Review", fields: [] },
];

type UserData = {
  name: string;
  birthYear: number;
  occupation: string;
  interests: string[];
  lifeGoals: string;
  financialLiteracyDetails: string;
  hasBaby: boolean;
  waitingForBaby: boolean;
  babyInfo: string;
};

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const router = useRouter();
  const [userData, setUserData] = useState<UserData>({
    name: "",
    birthYear: new Date().getFullYear() - 25,
    occupation: "",
    interests: [],
    lifeGoals: "",
    financialLiteracyDetails: "",
    hasBaby: false,
    waitingForBaby: false,
    babyInfo: "",
  });

  const [years, setYears] = useState<number[]>([]);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isNextDisabled, setIsNextDisabled] = useState(true);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);
    setYears(years);
    setCurrentYear(currentYear);
  }, []);

  useEffect(() => {
    const currentStepFields = steps[step].fields;
    const isStepValid = currentStepFields.every(field => {
      if (field === 'interests') return userData[field].length > 0;
      if (step === 5) return userData.hasBaby || userData.waitingForBaby || (!userData.hasBaby && !userData.waitingForBaby);
      return userData[field as keyof UserData] !== '';
    });
    setIsNextDisabled(!isStepValid);
  }, [step, userData]);

  useEffect(() => {
    if (step === 5) {
      const age = currentYear - userData.birthYear;
      if (age < 18 || userData.occupation === "student") {
        setUserData(prevState => ({
          ...prevState,
          hasBaby: false,
          waitingForBaby: false,
          babyInfo: "",
        }));
      }
    }
  }, [step, userData.birthYear, userData.occupation, currentYear]);

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem("userData", JSON.stringify(userData));
      router.push("/chat");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };  

  const handleYearChange = (value: string) => {
    setUserData({ ...userData, birthYear: parseInt(value, 10) });
  };

  const handleSelectChange = (value: string) => {
    setUserData({ ...userData, occupation: value });
  };

  const [interestSuggestions, setInterestSuggestions] = useState(initialSuggestions);

  const handleInterestAdd = (value: string) => {
    if (value && !userData.interests.includes(value) && userData.interests.length < 10) {
      setUserData((prevState) => ({
        ...prevState,
        interests: [...prevState.interests, value],
      }));
      setInterestSuggestions((prevSuggestions: any[]) => prevSuggestions.filter((suggestion) => suggestion !== value));
    }
  };
  
  const handleInterestRemove = (interest: string) => {
    setUserData((prevState) => ({
      ...prevState,
      interests: prevState.interests.filter((i) => i !== interest),
    }));
    setInterestSuggestions((prevSuggestions: any) => [...prevSuggestions, interest]);
  };

  const handleCheckboxChange = (field: keyof UserData) => {
    setUserData(prevState => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const progress = (step / (steps.length - 1)) * 100;

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-[#B9C7DC] text-gray-900 p-4">
      <Navbar />
      <Card className="w-full bg-gray-100/90 rounded-2xl overflow-hidden h-max border-opacity-5 max-w-lg">
        <CardHeader className="bg-gray-50  mb-4">
          <CardTitle className="text-sm font-medium text-gray-900">
          {Math.round(progress)}% {steps[step].title} 
        </CardTitle>
          <Progress value={progress} className="mb-6 h-1.5 rounded-full bg-[#B9C7DC]" aria-label={`Step ${step + 1} of ${steps.length}`} />
        </CardHeader>
        <CardContent>
          {step === 0 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">Your name</Label>
                <Input
                  id="name"
                  name="name"
                  value={userData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  className="w-full text-base px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-required="true"
                />
              </div>
              <div className="space-y-2">
                <div className="flex flex-row gap-2 items-center">
                  <Label htmlFor="birthYear" className="text-sm font-medium text-gray-700">Year of birth</Label>
                  <span className="text-xs text-gray-400">
                    ({currentYear - userData.birthYear} years old)
                  </span>
                </div>
                <Select onValueChange={handleYearChange} value={userData.birthYear.toString()}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your birth year" />
                  </SelectTrigger>
                  <SelectContent className="text-base">
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          {step === 1 && (
            <div className="space-y-8">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-900">Current life situation</h2>
                <div className="space-y-4">
                  <Label htmlFor="occupation" className="text-sm font-medium text-gray-700">Your Occupation</Label>
                  <Select onValueChange={handleSelectChange} value={userData.occupation}>
                    <SelectTrigger className="w-full p-3 text-base border border-gray-300 rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <SelectValue placeholder="Select your occupation" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-auto">
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="employed">Employed</SelectItem>
                      <SelectItem value="self-employed">Self-employed</SelectItem>
                      <SelectItem value="unemployed">Unemployed</SelectItem>
                      <SelectItem value="retired">Retired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Alert className="mt-4 bg-blue-50 rounded-xl">
                  <AlertDescription className="text-sm text-blue-800">
                    Your occupation helps us understand your daily experiences and future aspirations better.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-900">Your interests</h2>
                <p className="text-sm text-gray-600">
                  What are you passionate about? This helps us tailor your experience.
                </p>
              </div>
              <div className="space-y-4">
                <Label htmlFor="interests" className="text-sm font-medium text-gray-700">
                  Interests (max 10)
                </Label>
                <Input
                  id="interests"
                  placeholder="Type your interests and press Enter or use a comma"
                  className="w-full text-base p-3  border border-gray-300 rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onKeyDown={(e) => {
                    if ((e.key === "Enter" || e.key === ",") && e.currentTarget.value.trim()) {
                      handleInterestAdd(e.currentTarget.value.trim());
                      e.currentTarget.value = "";
                      e.preventDefault();
                    }
                  }}
                />
                <div className="mt-2 flex ">
                <Card className="flex flex-wrap gap-2 w-full p-4">
                  {userData.interests.map((interest, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer flex rounded-md items-center px-2 py-1 text-sm bg-[#EEE7C3] text-[#6B592E]">
                      {interest}
                      <button
                        className="ml-2 text-gray-500 hover:text-gray-700"
                        onClick={() => handleInterestRemove(interest)}
                        aria-label={`Remove ${interest}`}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                  </Card>
                </div>
                {userData.interests.length < 10 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700">Suggestions</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {interestSuggestions.map((suggestion, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer flex rounded-md items-center px-2 py-1 text-sm bg-[#EEE7C3] text-[#6B592E]"
                          onClick={() => handleInterestAdd(suggestion)}
                        >
                          {suggestion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <Alert className="mt-4 bg-blue-50 rounded-xl">
                <AlertDescription className="text-sm text-blue-800">
                  Add a few interests to help us understand you better. Press "Enter" or use a comma to separate each interest.
                </AlertDescription>
              </Alert>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-900">Your life goals</h2>
                <p className="text-sm text-gray-600">What are your main aspirations for the future?</p>
              </div>
              <div className="space-y-4">
                <Label htmlFor="lifeGoals" className="text-sm font-medium text-gray-700">
                  Life Goals
                </Label>
                <div className="relative mt-1 rounded-md">
                <textarea
                  id="lifeGoals"
                  name="lifeGoals"
                  value={userData.lifeGoals}
                  onChange={handleInputChange}
                  placeholder="Write 2-4 sentences to share your life goals."
                  rows={4}
                  className="block w-full p-3 text-base border border-gray-300 rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

                  <div className="absolute right-0 bottom-3 pr-3  items-center pointer-events-none">
                    <span className="text-mutated-foreground text-xs">
                      {userData.lifeGoals.length} / 1000
                    </span>
                  </div>
                </div>
              </div>
              <Alert className="mt-4 bg-blue-50 rounded-xl">
                <AlertDescription className="text-sm text-blue-800">
                  Think about your career, family, health, and personal aspirations. Be as specific or general as you like.
                </AlertDescription>
              </Alert>
            </div>
          )}
          {step === 4 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-900">Financial Literacy</h2>
                <p className="text-sm text-gray-600">Your understanding and knowledge about financial matters.</p>
              </div>
              <div className="space-y-4">
                <Label htmlFor="financialLiteracy" className="text-sm font-medium text-gray-700">
                  Financial Literacy
                </Label>
                <Label htmlFor="financialLiteracyDetails" className="text-sm font-medium text-gray-700">
                  Provide more details about your financial knowledge (e.g., budgeting, investing, saving, etc.)
                </Label>
                <textarea
                  id="financialLiteracyDetails"
                  name="financialLiteracyDetails"
                  value={userData.financialLiteracyDetails}
                  onChange={handleInputChange}
                  placeholder="For example: I have a basic understanding of budgeting and saving. I invest in mutual funds and have been learning about stock market investments."
                  rows={4}
                  className="block w-full p-3 text-base border border-gray-300 rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <Alert className="mt-4 bg-blue-50 rounded-xl">
                <AlertDescription className="text-sm text-blue-800">
                  Understanding financial literacy helps us provide better advice for your future.
                </AlertDescription>
              </Alert>
            </div>
          )}
          {step === 5 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-900">Baby Information</h2>
                <p className="text-sm text-gray-600">Do you have or are you expecting a baby?</p>
              </div>
              <div className="space-y-4">
                <Label htmlFor="hasBaby" className="text-sm font-medium text-gray-700">Do you have a baby?</Label>
                <div className="flex items-center space-x-2">
                <Button
                  variant={userData.hasBaby ? "default" : "outline"}
                  onClick={() => handleCheckboxChange('hasBaby')}
                >
                  {userData.hasBaby ? "Yes" : "No"}
                </Button>
                </div>
              </div>
              <div className="space-y-4">
                <Label htmlFor="waitingForBaby" className="text-sm font-medium text-gray-700">Are you expecting a baby?</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={userData.waitingForBaby ? "default" : "outline"}
                    onClick={() => handleCheckboxChange('waitingForBaby')}
                  >
                    {userData.waitingForBaby ? "Yes" : "No"}
                  </Button>
                </div>
              </div>
              {(userData.hasBaby || userData.waitingForBaby) && (
                <div className="space-y-4">
                  <Label htmlFor="babyInfo" className="text-sm font-medium text-gray-700">Baby Information</Label>
                  <Input
                    id="babyInfo"
                    name="babyInfo"
                    value={userData.babyInfo}
                    onChange={handleInputChange}
                    placeholder="Enter details about your baby or pregnancy"
                    className="w-full text-base p-3 border border-gray-300 rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
              <Alert className="mt-4 bg-blue-50 rounded-xl">
                <AlertDescription className="text-sm text-blue-800">
                  Providing this information helps us understand your family dynamics and provide relevant advice.
                </AlertDescription>
              </Alert>
            </div>
          )}
          {step === 6 && (
            <div className="space-y-8">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-900">Ready to meet your future self?</h2>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                <h3 className="text-md font-medium text-blue-800">Why Chat with Your Future Self?</h3>
                <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                  <li>Reduce anxiety and negative emotions</li>
                  <li>Increase future self-continuity</li>
                  <li>Gain clarity on your life goals and aspirations</li>
                  <li>Explore potential paths and make informed decisions</li>
                </ul>
                <p className="text-xs text-blue-600 italic">Based on the study: "Future You: A Conversation with an AI-Generated Future Self Reduces Anxiety, Negative Emotions, and Increases Future Self-Continuity"</p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex w-full gap-4 justify-between flex-col" >
          <Separator/>
          <div className={`flex w-full gap-2 justify-between ${step < steps.length - 1 ? 'flex-row' : 'flex-col-reverse'}`}>
          {step > 0 && (
            <Button
              onClick={prevStep}
              type="button"
              variant="outline"
              className="gap-1 w-full text-gray-600 border-gray-300 hover:bg-gray-100 focus:ring-2 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-3 text-center inline-flex items-center justify-center"
            >
              <ArrowLeft weight="bold" className="mr-2" />
              Back
            </Button>
          )}
          <Button
            onClick={nextStep}
            type="button"
            disabled={isNextDisabled}
            className={`gap-1 w-full text-gray-100 bg-gray-900 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium px-5 py-3 rounded-lg text-sm text-center inline-flex items-center justify-center ${step === 0 ? 'w-full' : 'ml-auto'} ${isNextDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {step < steps.length - 1 ? "Next" : "Start chat"}
            {step < steps.length - 1 ? <ArrowRight weight="bold" className="ml-2" /> : <Chats weight="bold" className="ml-2" />}
          </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
