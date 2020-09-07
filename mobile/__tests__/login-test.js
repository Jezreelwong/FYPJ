import 'react-native';
import { TextInput, View, Button } from 'react-native';
import React from 'react';
import AwsData from '../src/shared/AwsData'
// import { render, fireEvent } from 'react-native-testing-library';
import { fireEvent, NativeTestEvent, render, act } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../src/screens/login-screen';
import '@testing-library/jest-native/extend-expect';
// import App from '../App'

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

beforeEach(() => {
  fetch.resetMocks();
});

// it('Test Login PU Function', async () => {
//   fetch.mockResponses(
//     [
//       JSON.stringify({
//         statusCode: 200,
//         body: JSON.stringify({
//           keys: {
//             AccessToken: "1111",
//             RefreshToken: "1111",
//             IdToken: "1111"
//           },
//           userData: {
//             preferred_username: "blackpanther",
//             given_name: "Black",
//             family_name: "Panther",
//             "custom:role": "PU",
//             "custom:safUnit": "blackpanther",
//             "custom:performanceRating": "51.2",
//             email: "2014.felixchang@gmail.com"
//           },
//         })
//       })
//     ],
//     [
//       JSON.stringify({
//         statusCode: 200,
//         body: [
//           {
//             "serviceProviderType": "P",
//             "avgRating": 3.37
//           },
//           {
//             "serviceProviderType": "RPL",
//             "avgRating": 4.27
//           }
//         ]
//       })
//     ]
//   )

//   const awsData = new AwsData()
//   const userData = await awsData.loginAsync('blackpanther', 'P@ssw0rd')
//   expect(AwsData.user.role).toEqual('PU');
//   expect(AwsData.user.username).toEqual('blackpanther')
// });

// it("Test First Time Login Trigger Function", async () => {
//   fetch.mockResponses(
//     [
//       JSON.stringify({
//         statusCode: 200,
//         body: {
//           ChallengeName: "NewPasswordRequired",
//           Session: "1111"
//         }
//       })
//     ],
//     [
//       JSON.stringify({
//         statusCode: 200,
//         body: [
//           {
//             "serviceProviderType": "P",
//             "avgRating": 3.37
//           },
//           {
//             "serviceProviderType": "RPL",
//             "avgRating": 4.27
//           }
//         ]
//       })
//     ]
//   )

//   const awsData = new AwsData()
//   const session = await awsData.loginAsync('blackpanther', 'P@ssw0rd')
//   expect(session).toEqual('1111');
// })


// it("Test Encrypted Login Function", async () => {
//   fetch.mockResponseOnce(JSON.stringify({
//     statusCode: 200,
//     data: "U2FsdGVkX1+5agWy8MTQzIePoxC00UxcfPt4mYA8lCCIO21ZS6aQ4uhhk0ci+hOxOuD8OXdenKzTb9wG/8l+078ZnPSrO4hYugQ1aaKiqAiXyIerR7kuwMbmMigBp4dxbPf0IAyxT6DH+CUEFxGnJVkKnY7SN2Q9aM0LFQKf2bhuVxGjhSwyZJ1pwvGtw0/hcNZZE28SlX1h4Zd9m7vKt6cM7ZTuezKQDLabm78qoyoimmMpRJ23Hw6XO7G9AE7HNrKqJXN16MzkkJXGDdNauxPZxAW7svYibRKo3U2DX6yhLi4I12UUq/ho6wEcW/MF6AC09yWwJ8ueuHPvwaqv/ToWB87ZGs+8i8/qFJRtPtGlklLs0R5k6y6We/3p4l4mXLl/h75pZnjxj3dz2mTBePwt9Yd8wsuwofnBixWkusp7HyNvqFNj2Dtz+G3I5R3F0AhaQKnDcohhHJ7OetBroe2hvTpuA2elSqC3Pu8uOqO/ITeTOA/18Y8cUT9CHTVwbJ4fIsMVJBCBNtAHAqvFy/1EIF16NcKo1XRRPO0DvTd42Ib6VQzxsxkw++ji7GTcKBNO5nAzUQ4Snu24T/nyNjPJLzxNy8mmMgYBC9wqw7RVSMSZcxthVm24CfR9c+e/YGE7oMIWKNEE3qzKm9vNN5uX9DYVW0hc4ht2V6QA6Esjd93KdfYMOtF03A9gy8q0kpqB8ugG7OlydtA51RmR65ORQqtPUriS6bCMxevhiKY+uf2RnKgE+If+3/BG9RD7CE+X/15JbvqqYU1Fe7BXND9wYh7ZdDL6FCzfuyEzw1eaAwhq8tEQfO0vNXIrMVgL099iUpddSF1xIlr7+aiUUupWpTaUsmGZYkiq5ykXH68=",
//     email: "184708Y@mymail.nyp.edu.sg",
//     body: ""
//   })
//   )

//   const awsData = new AwsData()
//   const user = await awsData.loginEncrypted("pinkpanther", "P@ssw0rd")
//   expect(AwsData.user.role).toEqual('U');
// })

it('Test Login Screen Input/Render', async () => {
    fetch.mockResponses(
    [
      JSON.stringify({
        statusCode: 200,
        body: JSON.stringify({
          keys: {
            AccessToken: "1111",
            RefreshToken: "1111",
            IdToken: "1111"
          },
          userData: {
            preferred_username: "bluefrog",
            given_name: "Blue",
            family_name: "Frog",
            "custom:role": "PU",
            "custom:safUnit": "bluefrog",
            "custom:performanceRating": "51.2",
            email: "2014.felixchang@gmail.com"
          },
        })
      })
    ],
    [
      JSON.stringify({
        statusCode: 200,
        body: [
          {
            "serviceProviderType": "P",
            "avgRating": 3.37
          },
          {
            "serviceProviderType": "RPL",
            "avgRating": 4.27
          }
        ]
      })
    ]
  )

  const password = "P@ssw0rd"
  const username = "bluefrog"
  const mock = jest.fn()
  const mock2 = jest.fn()
  const { getByPlaceholderText, getByText, getByTestId } = render(
    <NavigationContainer>
      <LoginScreen />
    </NavigationContainer>
  );

  const loginBtn = getByTestId('loginBtn')
  const passwordInput = getByPlaceholderText('Password')
  const usernameInput = getByPlaceholderText('Username')
  const forgetPasswordText = getByTestId("forgotText")

  await act(async () => {
    fireEvent.changeText(usernameInput, username);
    fireEvent.changeText(passwordInput, password);
    // fireEvent.press(loginBtn, {nativeEvent: { onPress: mock2 }} )
    fireEvent.press(loginBtn)
  })

  expect(loginBtn).toHaveTextContent('Log in')
  // expect(mock2).toHaveBeenCalledTimes(1)
  // expect(passwordInput.props.value).toEqual(password)
  expect(forgetPasswordText).toHaveTextContent("Forgot Password?")
})

it('Example Component Test', async () => {
  const mock = jest.fn()
  const mock2 = jest.fn()
  const text = "Test"
  const { getByPlaceholderText, getByText } = render(
    <View>
      <TextInput placeholder="Password" onChangeText={mock}></TextInput>
      <Button title="Submit" onPress={mock2}></Button>
    </View>
  );

  await act(async () => {
    fireEvent.changeText(getByPlaceholderText('Password'), text);
    fireEvent.press(getByText('Submit'))
    fireEvent.press(getByText('Submit'))
  })
  expect(mock).toHaveBeenCalledWith(text);
  expect(mock2).toHaveBeenCalledTimes(2)

})

// it('Login screen renders correctly (Snapshot)', async () => {
//   let tree;
//   await act(async () => {
//     tree = await renderer
//     .create(<NavigationContainer><LoginScreen /></NavigationContainer>)
//     .toJSON();
//   })
//   expect(tree).toMatchSnapshot();
// })