package com.web2.global.Aop;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD) // 메소드에만 적용
@Retention(RetentionPolicy.RUNTIME) // 런타임 동안에
public @interface SecureEndPoint {
}
