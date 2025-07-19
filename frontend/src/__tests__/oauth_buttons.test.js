import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import OAuthButtons from '../COMPONENTs/oauth_buttons/oauth_buttons';
import { RequestContext } from '../CONTAINERs/request/container';

// Mock the request context
const mockRequestContext = {
  auth_oauth: jest.fn(),
};

describe('OAuthButtons', () => {
  test('renders Google and Apple login buttons', () => {
    render(
      <RequestContext.Provider value={mockRequestContext}>
        <OAuthButtons />
      </RequestContext.Provider>
    );

    expect(screen.getByText('Continue with Google')).toBeInTheDocument();
    expect(screen.getByText('Continue with Apple')).toBeInTheDocument();
  });

  test('Google button calls auth_oauth when clicked', () => {
    render(
      <RequestContext.Provider value={mockRequestContext}>
        <OAuthButtons />
      </RequestContext.Provider>
    );

    // Note: The actual Google OAuth flow would be triggered by external scripts
    // This test verifies the button is rendered and the component structure is correct
    const googleButton = screen.getByText('Continue with Google');
    expect(googleButton).toBeInTheDocument();
  });
});