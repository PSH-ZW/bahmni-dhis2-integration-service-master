package com.thoughtworks.bahmnidhis2integrationservice.interceptor;

import com.thoughtworks.bahmnidhis2integrationservice.config.AppProperties;
import com.thoughtworks.bahmnidhis2integrationservice.security.OpenMRSAuthenticator;
import lombok.SneakyThrows;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.powermock.core.classloader.annotations.PowerMockIgnore;
import org.powermock.modules.junit4.PowerMockRunner;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import static com.thoughtworks.bahmnidhis2integrationservice.security.AuthenticationResponse.AUTHORIZED;
import static com.thoughtworks.bahmnidhis2integrationservice.security.AuthenticationResponse.NOT_AUTHENTICATED;
import static com.thoughtworks.bahmnidhis2integrationservice.security.AuthenticationResponse.UNAUTHORIZED;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(PowerMockRunner.class)
@PowerMockIgnore("javax.management.*")
public class AuthenticationInterceptorTest {

  @Mock
  private HttpServletRequest httpServletRequestMock;

  @Mock
  private HttpServletResponse httpServletResponseMock;

  @Mock
  private AppProperties appProperties;

  @Mock
  private OpenMRSAuthenticator authenticator;

  private AuthenticationInterceptor authenticationInterceptor;

  private Cookie[] cookies;

  private static final String REPORTING_COOKIE_NAME = "reporting_session";
  private static final String COOKIE_VALUE = "SOME_REPORTING_SESSION_ID";


  @Before
  public void setUp() throws Exception {
    authenticationInterceptor = new AuthenticationInterceptor(authenticator, appProperties);
    Cookie cookie = new Cookie(REPORTING_COOKIE_NAME, COOKIE_VALUE);
    cookies = new Cookie[1];
    cookies[0] = cookie;
  }

  @Test
  @SneakyThrows
  public void shouldAuthenticateIfReportingSessionIdIsValidatedByOpenMRS() {
    when(httpServletRequestMock.getCookies()).thenReturn(cookies);
    when(authenticator.authenticate(COOKIE_VALUE)).thenReturn(AUTHORIZED);

    boolean response = authenticationInterceptor.preHandle(httpServletRequestMock, httpServletResponseMock, new Object());

    verify(authenticator, times(1)).authenticate(COOKIE_VALUE);
    Assert.assertTrue(response);

  }

  @Test
  @SneakyThrows
  public void shouldNotAuthenticateIfReportingSessionIdIsValidatedByOpenMRSButDoesNotHavePrivileges() {
    when(httpServletRequestMock.getCookies()).thenReturn(cookies);
    when(authenticator.authenticate(COOKIE_VALUE)).thenReturn(UNAUTHORIZED);

    boolean response = authenticationInterceptor.preHandle(httpServletRequestMock, httpServletResponseMock, new Object());

    verify(authenticator, times(1)).authenticate(COOKIE_VALUE);
    Assert.assertFalse(response);

  }

  @Test
  @SneakyThrows
  public void shouldNotAuthenticateWithoutReportingSessionIdByOpenMRSAndRedirectToUI() {
    when(httpServletRequestMock.getCookies()).thenReturn(null);

    boolean response = authenticationInterceptor.preHandle(httpServletRequestMock, httpServletResponseMock, new Object());

    verify(authenticator, times(0)).authenticate(any());
    Assert.assertTrue(response);
  }

  @Test
  @SneakyThrows
  public void shouldReturnFalseIfReportingSessionIdIsInvalidatedByOpenMRS() {
    when(httpServletRequestMock.getCookies()).thenReturn(cookies);
    when(authenticator.authenticate(COOKIE_VALUE)).thenReturn(NOT_AUTHENTICATED);

    boolean response = authenticationInterceptor.preHandle(httpServletRequestMock, httpServletResponseMock, new Object());

    verify(authenticator, times(1)).authenticate(COOKIE_VALUE);
    Assert.assertFalse(response);
  }

  @Test
  @SneakyThrows
  public void shouldNotCallOpenMRSIfHandlerIsNull() {
    boolean response = authenticationInterceptor.preHandle(httpServletRequestMock, httpServletResponseMock, null);

    Assert.assertFalse(response);
  }

  @Test
  public void shouldReturnFalseAndLogErrorWhenUserIsNotAuthenticated() throws Exception {
    Cookie cookie = new Cookie("not_reporting_session", null);
    cookies[0] = cookie;

    when(httpServletRequestMock.getCookies()).thenReturn(cookies);

    boolean response = authenticationInterceptor.preHandle(httpServletRequestMock, httpServletResponseMock, new Object());

    verify(httpServletResponseMock, times(1)).setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    Assert.assertFalse(response);
  }
}
