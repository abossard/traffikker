# Traffikker

Or how to remove path prefixes in a nice way with Traefik.

## Prerequisites
1. You need to understand, that with Traefik you modify the request with middleware and not just with annotations
2. So you first need to create a middleware and then reference it in the ingress
3. In this example I have 3 ingress paths:
   1. / for the website
   2. /api/runtime for a fictional API
   3. /api/system for another fictional API

> WARNING: The middleware is referenced with a total weird naming scheme (to me):
> ` <namespace>-<middlewarename>@kubernetescrd`
> So if you have a middleware called `level1strip` in the `default` namespace, the reference of the middleware is `default-level1strip@kubernetescrd`

## Implementation

### of the middleware
```yaml
apiVersion: traefik.containo.us/v1alpha1
kind: Middleware
metadata:
  name: level1strip
spec:
  stripPrefixRegex:
    regex:
      - "/api/[^/]+" // this will remove the first and second path segment (if has /api/ in it)
```
Now I create two ingress definitions, one for the website and one for the APIs, since I only want to have the prefix removal in the APIs, the website is anyway on the root /.
### Ingress for the apis:
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: apimyingress
  labels:
    name: apimyingress
  annotations:
    traefik.ingress.kubernetes.io/router.middlewares: default-level1strip@kubernetescrd
spec:
  rules:
  - http:
        paths:
        - path: /api/system
          pathType: Prefix
          backend:
            service:
              name: myapp
              port:
                number: 8080
        - path: /api/runtime
          pathType: Prefix
          backend:
            service:
              name: myapp
              port:
                number: 8080
```

### Ingress for the website:
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: myingress
  labels:
    name: myingress
spec:
  rules:
  - http:
        paths:
        - path: /
          pathType: Prefix
          backend:
            service:
              name: myapp
              port:
                number: 8080
```

## Relevant Links
1. [Traefik Strip Prefix Middleware](https://doc.traefik.io/traefik/middlewares/http/stripprefixregex/)
2. [Traefik Ingress Annotations](https://doc.traefik.io/traefik/routing/providers/kubernetes-ingress/#annotations)

## Conclusion
First I was a bit thrown off that there's not basic annotation that just removes the prefix. But now I see that Traefik handles also complex stuff with some grace. So that's nice ok.

## License
[MIT](https://choosealicense.com/licenses/mit/)