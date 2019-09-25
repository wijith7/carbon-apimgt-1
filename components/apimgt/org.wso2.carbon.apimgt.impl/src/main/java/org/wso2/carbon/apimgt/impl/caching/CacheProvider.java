/*
 *   Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 *   WSO2 Inc. licenses this file to you under the Apache License,
 *   Version 2.0 (the "License"); you may not use this file except
 *   in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an
 *  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *  KIND, either express or implied.  See the License for the
 *  specific language governing permissions and limitations
 *  under the License.
 */

package org.wso2.carbon.apimgt.impl.caching;

import org.wso2.carbon.apimgt.impl.APIConstants;
import org.wso2.carbon.apimgt.impl.internal.ServiceReferenceHolder;
import org.wso2.carbon.apimgt.impl.APIManagerConfiguration;
import org.wso2.carbon.apimgt.impl.utils.APIUtil;
import org.wso2.carbon.base.ServerConfiguration;
import org.wso2.carbon.caching.impl.Util;

import javax.cache.Cache;
import javax.cache.Caching;

/**
 * Class for initiating and returning caches. Creating cache take place when super tenant loading and tenant loading
 */
public class CacheProvider {

    /**
     * @return gateway key cache
     */
    public static Cache getGatewayKeyCache() {
        return getCache(APIConstants.GATEWAY_KEY_CACHE_NAME);
    }

    /**
     * @return gateway token cache
     */
    public static Cache getGatewayTokenCache() {
        return getCache(APIConstants.GATEWAY_TOKEN_CACHE_NAME);
    }

    /**
     * @return invalid token cache
     */
    public static Cache getInvalidTokenCache() {
        return getCache(APIConstants.GATEWAY_INVALID_TOKEN_CACHE_NAME);
    }

    /**
     * @return resource cache
     */
    public static Cache getResourceCache() {
        return getCache(APIConstants.RESOURCE_CACHE_NAME);
    }

    /**
     * @return APIManagerConfiguration
     */
    private static APIManagerConfiguration getApiManagerConfiguration() {
        return ServiceReferenceHolder.getInstance().getAPIManagerConfigurationService().getAPIManagerConfiguration();
    }

    /**
     * create cache with following parameters
     *
     * @param cacheManagerName Name of the cache manager
     * @param cacheName        Name of the cache need to be created
     * @param modifiedExp      Timeout value
     * @param accessExp        Timeout value
     * @return
     */
    private static Cache getCache(final String cacheManagerName, final String cacheName, final long modifiedExp,
                                  long accessExp) {
        return APIUtil.getCache(cacheManagerName, cacheName, modifiedExp, accessExp);
    }

    /**
     * @param cacheName name of the requested cache
     * @return cache
     */
    private static Cache getCache(final String cacheName) {
        return APIUtil.getCache(APIConstants.API_MANAGER_CACHE_MANAGER, cacheName);
    }

    /**
     * @return default cache timeout value
     */
    public static long getDefaultCacheTimeout() {
        if (ServerConfiguration.getInstance().getFirstProperty(APIConstants.DEFAULT_CACHE_TIMEOUT) != null) {
            return Long.valueOf(ServerConfiguration.getInstance().getFirstProperty(APIConstants.
                    DEFAULT_CACHE_TIMEOUT)) * 60;
        }
        return APIConstants.DEFAULT_TIMEOUT;
    }

    /**
     * Create and return GATEWAY_KEY_CACHE_NAME
     */
    public static Cache createGatewayKeyCache() {
        String apimGWCacheExpiry = getApiManagerConfiguration().getFirstProperty(APIConstants.TOKEN_CACHE_EXPIRY);
        if (apimGWCacheExpiry != null) {
            return getCache(APIConstants.API_MANAGER_CACHE_MANAGER, APIConstants.GATEWAY_KEY_CACHE_NAME,
                    Long.parseLong(apimGWCacheExpiry), Long.parseLong(apimGWCacheExpiry));
        } else {
            long defaultCacheTimeout =
                    getDefaultCacheTimeout();
            return getCache(APIConstants.API_MANAGER_CACHE_MANAGER, APIConstants.GATEWAY_KEY_CACHE_NAME,
                    defaultCacheTimeout, defaultCacheTimeout);
        }
    }

    /**
     * Create and return RESOURCE_CACHE
     */
    public static Cache createResourceCache() {
        APIManagerConfiguration config = getApiManagerConfiguration();
        String gatewayTokenCacheExpiry = config.getFirstProperty(APIConstants.GATEWAY_RESOURCE_CACHE_TIMEOUT);
        if (gatewayTokenCacheExpiry != null) {
            return getCache(APIConstants.API_MANAGER_CACHE_MANAGER, APIConstants.RESOURCE_CACHE_NAME,
                    Long.parseLong(gatewayTokenCacheExpiry), Long.parseLong(gatewayTokenCacheExpiry));
        } else {
            long defaultCacheTimeout = getDefaultCacheTimeout();
            return getCache(APIConstants.API_MANAGER_CACHE_MANAGER, APIConstants.RESOURCE_CACHE_NAME,
                    defaultCacheTimeout, defaultCacheTimeout);
        }
    }

    /**
     * Create and return GATEWAY_TOKEN_CACHE
     */
    public static Cache createGatewayTokenCache() {
        String apimGWCacheExpiry = getApiManagerConfiguration().getFirstProperty(APIConstants.TOKEN_CACHE_EXPIRY);
        if (apimGWCacheExpiry != null) {
            return getCache(APIConstants.API_MANAGER_CACHE_MANAGER, APIConstants.GATEWAY_TOKEN_CACHE_NAME,
                    Long.parseLong(apimGWCacheExpiry), Long.parseLong(apimGWCacheExpiry));
        } else {
            long defaultCacheTimeout = getDefaultCacheTimeout();
            return getCache(APIConstants.API_MANAGER_CACHE_MANAGER, APIConstants.GATEWAY_TOKEN_CACHE_NAME,
                    defaultCacheTimeout, defaultCacheTimeout);
        }

    }

    /**
     * Create and return GATEWAY_INVALID_TOKEN_CACHE
     */
    public static Cache createInvalidTokenCache() {
        String apimGWCacheExpiry = getApiManagerConfiguration().getFirstProperty(APIConstants.TOKEN_CACHE_EXPIRY);
        if (apimGWCacheExpiry != null) {
            return getCache(APIConstants.API_MANAGER_CACHE_MANAGER, APIConstants
                    .GATEWAY_INVALID_TOKEN_CACHE_NAME, Long.parseLong(apimGWCacheExpiry), Long.parseLong
                    (apimGWCacheExpiry));
        } else {
            long defaultCacheTimeout = getDefaultCacheTimeout();
            return getCache(APIConstants.API_MANAGER_CACHE_MANAGER, APIConstants
                    .GATEWAY_INVALID_TOKEN_CACHE_NAME, defaultCacheTimeout, defaultCacheTimeout);
        }
    }

    /**
     * remove caches from API_MANAGER_CACHE
     */
    public static void removeAllCaches() {
        Caching.getCacheManager(APIConstants.API_MANAGER_CACHE_MANAGER).removeCache(CacheProvider.
                getGatewayKeyCache().getName());
        Caching.getCacheManager(APIConstants.API_MANAGER_CACHE_MANAGER).removeCache(CacheProvider.
                getResourceCache().getName());
        Caching.getCacheManager(APIConstants.API_MANAGER_CACHE_MANAGER).removeCache(CacheProvider.
                getGatewayTokenCache().getName());
        Caching.getCacheManager(APIConstants.API_MANAGER_CACHE_MANAGER).removeCache(CacheProvider.
                getInvalidTokenCache().getName());
    }
}