package com.thoughtworks.bahmnidhis2integrationservice.interceptor;

import com.thoughtworks.bahmnidhis2integrationservice.config.AppProperties;
import com.thoughtworks.bahmnidhis2integrationservice.security.AuthenticationResponse;
import com.thoughtworks.bahmnidhis2integrationservice.security.OpenMRSAuthenticator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component(value = "authenticationFilter")
public class AuthenticationInterceptor extends HandlerInterceptorAdapter {

    private Logger logger = LoggerFactory.getLogger(AuthenticationInterceptor.class);

    public static final String REPORTING_COOKIE_NAME = "reporting_session";
    private OpenMRSAuthenticator authenticator;
    private AppProperties appProperties;

    @Autowired
    public AuthenticationInterceptor(OpenMRSAuthenticator authenticator,
                                     AppProperties appProperties) {
        this.authenticator = authenticator;
        this.appProperties = appProperties;
    }


    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        //TODO: bypassing preHandle check, remove this.
        if(true) {
            return true;
        }
        if (handler == null) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND,
                    "Application cannot handle url " + request.getRequestURI());
            return false;
        }

        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return true;
        }
        AuthenticationResponse authenticationResponse = AuthenticationResponse.NOT_AUTHENTICATED;

        for (Cookie cookie : cookies) {
            if (cookie.getName().equals(REPORTING_COOKIE_NAME)) {
                authenticationResponse = authenticator.authenticate(cookie.getValue());
            }
        }
        switch (authenticationResponse) {
            case AUTHORIZED:
                return true;
            case UNAUTHORIZED:
                response.sendError(HttpServletResponse.SC_FORBIDDEN,
                        "Privileges is required to access DHIS2 sync");
                logger.error(this.getClass().getName() + ": Privileges is required to access DHIS2 sync");
                return false;
            default:
                logger.error(this.getClass().getName() + ": Not authenticated user.");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return false;
        }
    }
}
