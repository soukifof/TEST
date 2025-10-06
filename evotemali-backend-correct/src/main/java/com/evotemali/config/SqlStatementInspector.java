package com.evotemali.config;

import org.hibernate.resource.jdbc.spi.StatementInspector;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class SqlStatementInspector implements StatementInspector {
    
    private static final Logger logger = LoggerFactory.getLogger(SqlStatementInspector.class);
    
    @Override
    public String inspect(String sql) {
        if (sql != null && sql.trim().length() > 0) {
            logger.debug("Executing SQL: {}", sql);
        }
        return sql;
    }
}