package com.thoughtworks.bahmnidhis2integrationservice.model;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class KeyValue<K,V> implements Serializable {
    private K key;
    private V value;

    public KeyValue(K key, V value) {
        this.key = key;
        this.value = value;
    }

    public KeyValue() {

    }

    public K getKey() {
        return key;
    }

    public void setKey(K key) {
        this.key = key;
    }

    public V getValue() {
        return value;
    }

    public void setValue(V value) {
        this.value = value;
    }

    public static <K,V> Map<K,V> toMap(List<KeyValue<K,V>> lines) {
        Map<K,V> ret = new HashMap<>();
        for (KeyValue<K, V> line : lines) {
            ret.put(line.getKey(), line.getValue());
        }
        return ret;
    }

    @Override
    public String toString() {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.writeValueAsString(this);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return null;
    }
}
